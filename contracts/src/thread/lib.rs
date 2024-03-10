#![cfg_attr(not(feature = "std"), no_std, no_main)]

pub use self::thread::{Thread, ThreadRef};

#[ink::contract]
mod thread {
    use ink::prelude::string::String;
    use ink::prelude::vec::Vec;

    #[ink(event)]
    pub struct ThreadCreated {
        creator: AccountId,
        message: String,
        parent: Option<AccountId>,
    }

    #[ink(event)]
    pub struct MessageUpdated {
        previous_message: String,
        new_message: String,
    }

    #[ink(storage)]
    pub struct Thread {
        message: String,
        likes: Vec<AccountId>,
        creator: AccountId,
        created_at: u64,
        children: Vec<ThreadRef>,
        parent: Option<AccountId>,
        thread_hash: Hash,
    }

    impl Thread {
        #[ink(constructor)]
        pub fn new(
            message: String,
            creator: AccountId,
            thread_hash: Hash,
            parent: Option<AccountId>,
        ) -> Self {
            let created_at = Self::env().block_timestamp();
            let children = Vec::default();

            let thread = Self {
                message,
                creator,
                children,
                parent,
                created_at,
                thread_hash,
                likes: Vec::default(),
            };

            Self::env().emit_event(ThreadCreated {
                creator,
                parent,
                message: thread.message.clone(),
            });
            thread
        }

        #[ink(message)]
        pub fn like(&mut self) {
            let has_liked = self.likes.contains(&self.env().caller());
            if !has_liked {
                self.likes.push(self.env().caller());
            }
        }

        #[ink(message)]
        pub fn get_likes(&self) -> u32 {
            self.likes.len() as u32
        }

        #[ink(message)]
        pub fn get_message(&self) -> String {
            self.message.clone()
        }

        #[ink(message)]
        pub fn get_creator(&self) -> AccountId {
            self.creator.clone()
        }

        #[ink(message)]
        pub fn comment(&mut self, message: String) -> ThreadRef {
            let author = self.env().caller();

            let comment_thread = ThreadRef::new(
                message,
                author,
                self.thread_hash,
                Some(self.env().account_id()),
            )
            .code_hash(self.thread_hash)
            .endowment(0)
            .salt_bytes([0xDE, 0xAD, 0xBE, 0xEF])
            .instantiate();

            self.children.push(comment_thread.clone());

            comment_thread
        }

        #[ink(message)]
        pub fn get_info(
            &self,
        ) -> (
            AccountId,
            String,
            u64,
            Vec<AccountId>,
            Vec<ThreadRef>,
            Option<AccountId>,
        ) {
            let message = self.message.clone();
            let likes = self.likes.clone();
            let created_at = self.created_at;
            let children = self.children.clone();
            let parent = self.parent.clone();
            let creator = self.creator.clone();

            (creator, message, created_at, likes, children, parent)
        }

        #[ink(message)]
        pub fn get_comments(&self) -> Vec<ThreadRef> {
            self.children.clone()
        }

        #[ink(message)]
        pub fn get_created_at(&self) -> u64 {
            self.created_at.clone()
        }

        #[ink(message)]
        pub fn set_message(&mut self, new_message: String) {
            let caller = self.env().caller();

            if caller != self.creator {
                panic!("Only the creator can update the message");
            }

            let previous_message = self.message.clone();

            self.message = new_message.clone();

            self.env().emit_event(MessageUpdated {
                previous_message,
                new_message,
            });
        }
    }

    #[cfg(test)]
    mod tests {
        use super::*;
        use ink::{codegen::Env, env::test::DefaultAccounts};

        fn get_default_message() -> String {
            "Message for new thread".to_string()
        }

        fn get_accounts() -> DefaultAccounts<ink::env::DefaultEnvironment> {
            let accounts = ink::env::test::default_accounts::<ink::env::DefaultEnvironment>();

            accounts
        }

        fn create_test_thread(message: String, parent: Option<AccountId>) -> Thread {
            let accounts = get_accounts();

            Thread::new(message, accounts.alice, Hash::from([0x42; 32]), parent)
        }

        fn create_thread_with_default_message() -> Thread {
            create_test_thread(get_default_message(), None)
        }

        #[ink::test]
        fn new_works() {
            let thread = create_thread_with_default_message();

            assert_eq!(thread.get_message(), get_default_message());
        }

        #[ink::test]
        fn like_works() {
            let mut thread = create_thread_with_default_message();

            thread.like();

            assert_eq!(thread.get_likes(), 1);
        }

        #[ink::test]
        fn set_message_works() {
            let mut thread = create_thread_with_default_message();

            let new_message: String = "New message for thread".to_string();
            thread.set_message(new_message.clone());

            assert_eq!(thread.get_message(), new_message);
        }

        #[ink::test]
        #[should_panic(expected = "Only the creator can update the message")]
        fn set_message_panics_for_non_creator() {
            let accounts = get_accounts();

            let non_creator = accounts.bob;

            let mut thread = create_thread_with_default_message();

            let new_message: String = "New message for thread".to_string();

            ink::env::test::set_caller::<ink::env::DefaultEnvironment>(non_creator);

            thread.set_message(new_message.clone());
        }

        #[ink::test]
        fn get_created_at_works() {
            let thread = create_thread_with_default_message();

            assert_eq!(thread.get_created_at(), thread.env().block_timestamp());
        }

        #[ink::test]
        fn get_creator_works() {
            let thread = create_thread_with_default_message();

            assert_eq!(thread.get_creator(), thread.env().caller());
        }

        #[ink::test]
        fn get_comments_works() {
            let mut thread = create_thread_with_default_message();

            let comment: String = "Comment for thread".to_string();
            let comment_id = thread.comment(comment.clone());

            assert_eq!(thread.get_comments(), vec![comment_id]);
        }
    }
}

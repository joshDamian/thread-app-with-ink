#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[ink::contract]

mod thread_manager {
    //use ink::env::call::{build_create, ExecutionInput, Selector};
    use ink::prelude::string::String;
    use ink::prelude::vec::Vec;
    use thread::ThreadRef;

    #[ink(storage)]
    pub struct ThreadManager {
        threads: Vec<ThreadRef>,
        thread_hash: Hash,
    }

    impl ThreadManager {
        #[ink(constructor)]
        pub fn new(thread_hash: Hash) -> Self {
            Self {
                threads: Vec::default(),
                thread_hash,
            }
        }

        #[ink(message)]
        pub fn create_thread(&mut self, message: String) -> (ThreadRef, String) {
            let creator = self.env().caller();

            let new_thread = ThreadRef::new(message.clone(), creator, self.thread_hash, None)
                .code_hash(self.thread_hash)
                .endowment(0)
                .salt_bytes([0xDE, 0xAD, 0xBE, 0xEF])
                .instantiate();

            self.threads.push(new_thread.clone());

            (new_thread, message)
        }

        #[ink(message)]
        pub fn get_threads(&self) -> Vec<ThreadRef> {
            self.threads.clone()
        }
    }
}

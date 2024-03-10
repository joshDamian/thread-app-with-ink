import { FC } from 'react'

import { threadMessageSchema, type ThreadMessageData } from '@/data/schemas/thread'
import { zodResolver } from '@hookform/resolvers/zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormItem, FormLabel } from '@/components/ui/form'

interface ThreadMessageFormProps {
  postThreadMessage: (message: string) => Promise<void>
  ctaText: string
  formTitle: string
}

const ThreadMessageForm: FC<ThreadMessageFormProps> = ({
  postThreadMessage,
  ctaText,
  formTitle,
}) => {
  const formMethods = useForm<ThreadMessageData>({
    resolver: zodResolver(threadMessageSchema),
  })

  const {
    handleSubmit,
    register,
    formState: { isSubmitting },
  } = formMethods

  const onSumbit: SubmitHandler<ThreadMessageData> = async (data) => {
    try {
      await postThreadMessage(data.message)
      formMethods.reset()

      toast.success('Message added successfully')
    } catch (e) {
      console.log({ error: e })
      toast.error('Something went wrong')
    }
  }

  return (
    <section>
      <Form {...formMethods}>
        <form onSubmit={handleSubmit(onSumbit)} className="flex flex-col gap-6">
          <FormItem>
            <FormLabel className="text-base">{formTitle}</FormLabel>
            <FormControl>
              <textarea
                rows={3}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                id="message"
                disabled={isSubmitting}
                {...register('message')}
              />
            </FormControl>
          </FormItem>
          <Button
            type="submit"
            className="bg-primary font-bold"
            disabled={isSubmitting}
            isLoading={isSubmitting}
          >
            {ctaText}
          </Button>
        </form>
      </Form>
    </section>
  )
}

export default ThreadMessageForm

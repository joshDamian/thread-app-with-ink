import { ComponentProps, FC } from 'react'

import ThreadPreviewLoader from './ThreadPreviewLoader'

type ThreadPreviewLoaderProps = ComponentProps<typeof ThreadPreviewLoader>

interface ListThreadsProps extends Omit<ThreadPreviewLoaderProps, 'threadId'> {
  threadIds: Array<string>
}

const ListThreads: FC<ListThreadsProps> = ({
  getPreviewInfo,
  threadIds,
  userAccount,
  likeThread,
}) => {
  return (
    <section className="flex flex-col gap-6">
      {threadIds.map((threadId) => (
        <ThreadPreviewLoader
          key={threadId}
          getPreviewInfo={getPreviewInfo}
          threadId={threadId}
          userAccount={userAccount}
          likeThread={likeThread}
        />
      ))}
    </section>
  )
}

export default ListThreads

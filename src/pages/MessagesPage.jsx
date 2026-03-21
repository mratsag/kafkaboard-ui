import { ClusterEmptyState } from '../components/ClusterEmptyState'
import { MessageViewer } from '../components/MessageViewer'

export function MessagesPage({ selectedCluster, ...props }) {
  if (!selectedCluster) {
    return (
      <ClusterEmptyState
        icon="✉️"
        title="Mesaj görüntüleyici hazır"
        description="Topic mesajlarını okumak için önce bir cluster seçin."
      />
    )
  }

  return <MessageViewer {...props} disabled={false} />
}

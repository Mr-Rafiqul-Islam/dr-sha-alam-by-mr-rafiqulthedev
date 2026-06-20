import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Button,
  DeleteConfirmationModal,
  Icon,
  Modal,
  PageHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/common";
import {
  useApproveDeleteRequestMutation,
  useGetPendingDeleteRequestsQuery,
  useRejectDeleteRequestMutation,
} from "../store/api/deleteRequestsApi";
import type { DeleteRequestEntityType, DeleteRequestListItem } from "../types/deleteRequest";

const TABS: Array<{ id: DeleteRequestEntityType; label: string }> = [
  { id: "BLOG", label: "Articles" },
  { id: "APPOINTMENT", label: "Appointments" },
  { id: "CONTACT_MESSAGE", label: "Contact Messages" },
];

function formatRequestedAt(value: string): string {
  return new Date(value).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function getRequesterLabel(request: DeleteRequestListItem): string {
  return request.requestedBy.name?.trim() || request.requestedBy.email || "Unknown user";
}

export function PendingDeletesPage() {
  const [activeTab, setActiveTab] = useState<DeleteRequestEntityType>("BLOG");
  const [approvingRequest, setApprovingRequest] =
    useState<DeleteRequestListItem | null>(null);
  const [rejectingRequest, setRejectingRequest] =
    useState<DeleteRequestListItem | null>(null);

  const {
    data: requests = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useGetPendingDeleteRequestsQuery(activeTab);

  const [approveDeleteRequest, { isLoading: isApproving }] =
    useApproveDeleteRequestMutation();
  const [rejectDeleteRequest, { isLoading: isRejecting }] =
    useRejectDeleteRequestMutation();

  useEffect(() => {
    if (isError) {
      toast.error("Failed to load pending delete requests");
      console.error(error);
    }
  }, [isError, error]);

  const handleRefresh = async () => {
    try {
      await refetch().unwrap();
      toast.info("Pending delete requests refreshed");
    } catch {
      toast.error("Failed to refresh pending delete requests");
    }
  };

  const handleApproveConfirm = async () => {
    if (!approvingRequest) return;

    try {
      await approveDeleteRequest(approvingRequest.id).unwrap();
      toast.success("Delete request approved");
      setApprovingRequest(null);
    } catch {
      toast.error("Failed to approve delete request");
    }
  };

  const handleRejectConfirm = async () => {
    if (!rejectingRequest) return;

    try {
      await rejectDeleteRequest(rejectingRequest.id).unwrap();
      toast.success("Delete request rejected");
      setRejectingRequest(null);
    } catch {
      toast.error("Failed to reject delete request");
    }
  };

  return (
    <div>
      <PageHeader
        title="Pending Deletes"
        subtitle="Review and confirm delete requests submitted by editors and support staff."
        action={
          <Button
            variant="ghost"
            leftIcon={<Icon name="refresh" size={20} />}
            onClick={handleRefresh}
            disabled={isFetching}
          >
            Refresh
          </Button>
        }
      />

      <div className="mb-stack-md flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "primary" : "ghost"}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      <div className="rounded-xl border border-outline-variant bg-surface-container-lowest overflow-hidden">
        {isLoading ? (
          <p className="p-stack-lg text-body-md text-on-surface-variant">
            Loading pending delete requests...
          </p>
        ) : requests.length === 0 ? (
          <p className="p-stack-lg text-body-md text-on-surface-variant">
            No pending delete requests.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Requested by</TableHead>
                <TableHead>Requested at</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>
                    <div className="min-w-0">
                      <p className="font-medium text-on-surface truncate">
                        {request.entitySummary.title}
                      </p>
                      {request.entitySummary.subtitle && (
                        <p className="text-body-sm text-on-surface-variant truncate">
                          {request.entitySummary.subtitle}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{getRequesterLabel(request)}</TableCell>
                  <TableCell>{formatRequestedAt(request.requestedAt)}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:bg-error-container/50 hover:text-error"
                        onClick={() => setApprovingRequest(request)}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setRejectingRequest(request)}
                      >
                        Reject
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <DeleteConfirmationModal
        open={!!approvingRequest}
        title="Approve delete request?"
        description={
          approvingRequest
            ? `This will permanently delete "${approvingRequest.entitySummary.title}".`
            : undefined
        }
        confirmLabel="Approve delete"
        isLoading={isApproving}
        onConfirm={handleApproveConfirm}
        onClose={() => setApprovingRequest(null)}
      />

      <Modal
        open={!!rejectingRequest}
        title="Reject delete request?"
        onClose={() => setRejectingRequest(null)}
      >
        <div className="flex flex-col gap-4">
          <p className="text-body-md text-on-surface-variant">
            {rejectingRequest
              ? `The item "${rejectingRequest.entitySummary.title}" will remain unchanged.`
              : null}
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setRejectingRequest(null)}>
              Cancel
            </Button>
            <Button onClick={handleRejectConfirm} disabled={isRejecting}>
              Reject request
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

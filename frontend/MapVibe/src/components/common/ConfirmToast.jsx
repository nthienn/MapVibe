import { toast } from "react-toastify";

const ConfirmToast = ({ message, onConfirm, onCancel }) => {
  const handleConfirm = async () => {
    toast.dismiss();

    try {
      await onConfirm();
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancel = () => {
    toast.dismiss();
    onCancel?.();
  };

  return (
    <div className="confirm-toast">
      <p>{message}</p>

      <div className="confirm-toast-actions">
        <button type="button" className="button" onClick={handleConfirm}>
          Confirm
        </button>

        <button type="button" className="button" onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export const showConfirmToast = ({ message, onConfirm, onCancel }) => {
  toast(
    <ConfirmToast
      message={message}
      onConfirm={onConfirm}
      onCancel={onCancel}
    />,
    {
      autoClose: false,
      closeOnClick: false,
      closeButton: false,
    },
  );
};

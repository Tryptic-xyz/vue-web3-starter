import { useToast } from "vue-toastification";

const toast = useToast();

export const errorToast = ({ txError, txURL }) => {
  return (
    <div>
      <p>{txError}</p>
      {txURL && (
        <p>
          <a
            className="underline"
            href={txURL}
            target="_blank"
            rel="noopener noreferrer"
          >
            View it on Etherscan
          </a>
        </p>
      )}
    </div>
  );
};

export const successToast = ({ message, txURL }) => {
  return (
    <div>
      <p>{message || "Transaction Successful."}</p>
      <p>
        <a
          className="underline"
          href={txURL}
          target="_blank"
          rel="noopener noreferrer"
        >
          View it on Etherscan
        </a>
      </p>
    </div>
  );
};

export function showErrorToast(tx) {
  toast.error(errorToast({ txError: tx.error.message, txURL: tx.txURL }), {
    timeout: false,
  });
}

export function showSuccessToast({ txURL, message }) {
  toast.success(successToast({ txURL, message }), {
    timeout: false,
  });
}

export function showTxToast(tx) {
  if (tx.error) {
    showErrorToast(tx);
  } else {
    showSuccessToast(tx);
  }
}

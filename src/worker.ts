
/**
 * Allows to create a Worker instance by defining logic source as a function
 * @param workerFunction
 */
export function createWorkerFromFunction (workerFunction: () => void): Worker {
  const workerBlob = new Blob(["(", workerFunction.toString(), ")()"], { type: "application/javascript" } );
  const workerURL  = URL.createObjectURL(workerBlob);
  const workerInst = new Worker(workerURL);
  URL.revokeObjectURL(workerURL);
  return workerInst;
}

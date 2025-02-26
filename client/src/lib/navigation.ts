type NavigateFn = (path: string, options?: object) => void;

export let navigate: NavigateFn = () => {};

export const setNavigate = (fn: NavigateFn) => {
  navigate = fn;
};

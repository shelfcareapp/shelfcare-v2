'use client';

import { useFormState } from 'react-dom';
import { toast } from 'react-toastify';

export function Form({
  children,
  action,
  className
}: {
  children: React.ReactNode;
  action: (prevState: any, formData?: FormData) => Promise<ActionResult>;
  className?: string;
}) {
  const [state, formAction] = useFormState(action, {
    error: null
  });

  if (state && state.error) {
    toast.error(state.error);
  }

  return (
    <form action={formAction} className={className}>
      {children}
    </form>
  );
}

export interface ActionResult {
  error: string | null;
}

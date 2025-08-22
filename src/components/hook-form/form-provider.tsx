import { FormProvider as RHFForm } from "react-hook-form";

// ----------------------------------------------------------------------

export function Form({
  children,
  onSubmit,
  methods,
}: {
  children: React.ReactNode;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  methods: any;
}) {
  return (
    <RHFForm {...methods}>
      <form onSubmit={onSubmit} noValidate autoComplete="off">
        {children}
      </form>
    </RHFForm>
  );
}

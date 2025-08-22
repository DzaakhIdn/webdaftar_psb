import dayjs from "dayjs";
import { z as zod } from "zod";

// ----------------------------------------------------------------------

interface MessageProps {
  required?: string;
  invalid_type?: string;
}

interface PhoneNumberProps {
  message?: MessageProps;
  isValid?: (value: string) => boolean;
}

interface DateProps {
  message?: MessageProps;
}

interface EditorProps {
  message?: string;
}

interface NullableInputOptions {
  message?: string;
}

interface BooleanProps {
  message?: string;
}

interface SliderRangeProps {
  min?: number;
  max?: number;
  message?: string;
}

interface FileProps {
  message?: string;
}

interface FilesProps {
  message?: string;
  minFiles?: number;
}

// ----------------------------------------------------------------------

export const schemaHelper = {
  /**
   * Phone number
   * Apply for phone number input.
   */
  phoneNumber: (props?: PhoneNumberProps) =>
    zod
      .string({
        message: props?.message?.required ?? "Phone number is required!",
      })
      .min(1, {
        message: props?.message?.required ?? "Phone number is required!",
      })
      .refine((data) => props?.isValid?.(data), {
        message: props?.message?.invalid_type ?? "Invalid phone number!",
      }),
  /**
   * Date
   * Apply for date pickers.
   */
  date: (props?: DateProps) =>
    zod.coerce
      .date()
      .nullable()
      .transform((dateString, ctx) => {
        const date = dayjs(dateString).format();

        const stringToDate = zod.string().pipe(zod.coerce.date());

        if (!dateString) {
          ctx.addIssue({
            code: zod.ZodIssueCode.custom,
            message: props?.message?.required ?? "Date is required!",
          });
          return null;
        }

        if (!stringToDate.safeParse(date).success) {
          ctx.addIssue({
            code: zod.ZodIssueCode.custom,
            message: props?.message?.invalid_type ?? "Invalid Date!!",
          });
        }

        return date;
      }),
  /**
   * Editor
   * defaultValue === '' | <p></p>
   * Apply for editor
   */
  editor: (props?: EditorProps) =>
    zod.string().min(8, { message: props?.message ?? "Content is required!" }),
  /**
   * Nullable Input
   * Apply for input, select... with null value.
   */
  nullableInput: <T>(schema: zod.ZodType<T>, options?: NullableInputOptions) =>
    schema.nullable().transform((val: T | null, ctx: zod.RefinementCtx) => {
      if (val === null || val === undefined) {
        ctx.addIssue({
          code: zod.ZodIssueCode.custom,
          message: options?.message ?? "Field can not be null!",
        });
        return val;
      }
      return val;
    }),
  /**
   * Boolean
   * Apply for checkbox, switch...
   */
  boolean: (props?: BooleanProps) =>
    zod.coerce.boolean().refine((val) => val === true, {
      message: props?.message ?? "Field is required!",
    }),
  /**
   * Slider
   * Apply for slider with range [min, max].
   */
  sliderRange: (props?: SliderRangeProps) =>
    zod
      .number()
      .array()
      .refine(
        (data) =>
          data[0] >= (props?.min ?? 0) && data[1] <= (props?.max ?? 100),
        {
          message:
            props?.message ??
            `Range must be between ${props?.min ?? 0} and ${props?.max ?? 100}`,
        }
      ),
  /**
   * File
   * Apply for upload single file.
   */
  file: (props?: FileProps) =>
    zod.custom().transform((data: unknown, ctx: zod.RefinementCtx) => {
      const hasFile =
        data instanceof File || (typeof data === "string" && !!data.length);

      if (!hasFile) {
        ctx.addIssue({
          code: "custom",
          message: props?.message ?? "File is required!",
        });
        return null;
      }

      return data;
    }),
  /**
   * Files
   * Apply for upload multiple files.
   */
  files: (props?: FilesProps) =>
    zod
      .array(zod.custom())
      .transform((data: unknown[], ctx: zod.RefinementCtx) => {
        const minFiles = props?.minFiles ?? 2;

        if (!data.length) {
          ctx.addIssue({
            code: "custom",
            message: props?.message ?? "Files is required!",
          });
        } else if (data.length < minFiles) {
          ctx.addIssue({
            code: "custom",
            message: `Must have at least ${minFiles} items!`,
          });
        }

        return data;
      }),
};

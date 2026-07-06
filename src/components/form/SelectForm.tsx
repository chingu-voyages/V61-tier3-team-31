import { Control, Controller, FieldValues, Path } from 'react-hook-form';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { Field, FieldError, FieldLabel } from '@/components/ui/field';

type SelectOption = {
  label: string;
  value: string;
};

type SelectFormProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  label: string;
  placeholder?: string;
  options: SelectOption[];
};

export function SelectForm<T extends FieldValues>({
  name,
  control,
  label,
  placeholder = 'Select option',
  options,
}: SelectFormProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={field.name}>{label}</FieldLabel>

          <Select
            value={field.value}
            onValueChange={field.onChange}
            onOpenChange={() => field.onBlur()}
          >
            <SelectTrigger
              id={field.name}
              aria-invalid={fieldState.invalid}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>

            <SelectContent className='max-h-72'>
              {options.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}

{
  /* <Controller
  name='timezone'
  control={control}
  render={({ field, fieldState }) => (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor={field.name}>Time zone</FieldLabel>

      <Select
        value={field.value}
        onValueChange={field.onChange}
        onOpenChange={() => field.onBlur()}
      >
        <SelectTrigger
          aria-invalid={fieldState.invalid}
          id={field.name}
        >
          <SelectValue placeholder='Select your timezone' />
        </SelectTrigger>
        <SelectContent className='max-h-72'>
          {timezones.map((tz) => (
            <SelectItem
              key={tz}
              value={tz}
            >
              {tz}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  )}
/>; */
}

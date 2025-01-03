Building Multi-Step forms with React.js
Jul 9, 2024
In this article, we explain how to build Multi-Step forms with Next.js and the library react-hook-form
next
react
In this post - I will show you how Makerkit implemented a nifty way to handle multi-step forms using React Hook Form, Zod and Shadcn UI.

The final output of this form is a multi-step form that allows users to navigate between steps, validate each step and submit the form. You can use it in your apps using the following React component:

'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@kit/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@kit/ui/form';
import { Input } from '@kit/ui/input';
import {
  MultiStepForm,
  MultiStepFormContextProvider,
  MultiStepFormHeader,
  MultiStepFormStep,
  createStepSchema,
  useMultiStepFormContext,
} from '@kit/ui/multi-step-form';
import { Stepper } from '@kit/ui/stepper';
const FormSchema = createStepSchema({
  account: z.object({
    username: z.string().min(3),
    email: z.string().email(),
  }),
  profile: z.object({
    password: z.string().min(8),
    age: z.coerce.number().min(18),
  }),
});
type FormValues = z.infer<typeof FormSchema>;
export function MultiStepFormDemo() {
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      account: {
        username: '',
        email: '',
      },
      profile: {
        password: '',
      },
    },
    reValidateMode: 'onBlur',
    mode: 'onBlur',
  });
  const onSubmit = (data: FormValues) => {
    console.log('Form submitted:', data);
  };
  return (
    <MultiStepForm
      className={'space-y-10 p-8 rounded-xl border'}
      schema={FormSchema}
      form={form}
      onSubmit={onSubmit}
    >
      <MultiStepFormHeader
        className={'flex w-full flex-col justify-center space-y-6'}
      >
        <h2 className={'text-xl font-bold'}>Create your account</h2>
        <MultiStepFormContextProvider>
          {({ currentStepIndex }) => (
            <Stepper
              variant={'numbers'}
              steps={['Account', 'Profile', 'Review']}
              currentStep={currentStepIndex}
            />
          )}
        </MultiStepFormContextProvider>
      </MultiStepFormHeader>
      <MultiStepFormStep name="account">
        <AccountStep />
      </MultiStepFormStep>
      <MultiStepFormStep name="profile">
        <ProfileStep />
      </MultiStepFormStep>
      <MultiStepFormStep name="review">
        <ReviewStep />
      </MultiStepFormStep>
    </MultiStepForm>
  );
}
function AccountStep() {
  const { form, nextStep, isStepValid } = useMultiStepFormContext();
  return (
    <Form {...form}>
      <div className={'flex flex-col gap-4'}>
        <FormField
          name="account.username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="account.email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button onClick={nextStep} disabled={!isStepValid()}>
            Next
          </Button>
        </div>
      </div>
    </Form>
  );
}
function ProfileStep() {
  const { form, nextStep, prevStep } = useMultiStepFormContext();
  return (
    <Form {...form}>
      <div className={'flex flex-col gap-4'}>
        <FormField
          name="profile.password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="profile.age"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Age</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-2">
          <Button type={'button'} variant={'outline'} onClick={prevStep}>
            Previous
          </Button>
          <Button onClick={nextStep}>Next</Button>
        </div>
      </div>
    </Form>
  );
}
function ReviewStep() {
  const { prevStep, form } = useMultiStepFormContext<typeof FormSchema>();
  const values = form.getValues();
  return (
    <div className={'flex flex-col space-y-4'}>
      <div className={'flex flex-col space-y-4'}>
        <div>Great! Please review the values.</div>
        <div className={'flex flex-col space-y-2 text-sm'}>
          <div>
            <span>Username</span>: <span>{values.account.username}</span>
          </div>
          <div>
            <span>Email</span>: <span>{values.account.email}</span>
          </div>
          <div>
            <span>Age</span>: <span>{values.profile.age}</span>
          </div>
        </div>
      </div>
      <div className="flex justify-end space-x-2">
        <Button type={'button'} variant={'outline'} onClick={prevStep}>
          Back
        </Button>
        <Button type={'submit'}>Create Account</Button>
      </div>
    </div>
  );
}
Dependencies of the Multi-Step Form
Before starting - please bear in mind this tutorial uses the following dependencies:

react-hook-form - for form handling
zod - for schema validation
Shadcn UI - for styling
Lucide React - for icons
Makerkit's imports - that you can replace with your own if you use Shadcn UI
Generally speaking, the code is generic enough to apply to other UI libraries.

Multi-Step Form Component
The MultiStepForm component is the main component that handles the multi-step form. It uses the useMultiStepForm hook to manage the form state and transitions between steps.

Let's declare some of the interfaces and types that we will use in the MultiStepForm component:

interface MultiStepFormProps<T extends z.ZodType> {
  schema: T;
  form: UseFormReturn<z.infer<T>>;
  onSubmit: (data: z.infer<T>) => void;
  useStepTransition?: boolean;
  className?: string;
}
type StepProps = React.PropsWithChildren<
  {
    name: string;
    asChild?: boolean;
  } & React.HTMLProps<HTMLDivElement>
>;
Multi-Step Form Context
The context MultiStepFormContext is used to pass the form state and methods to the child components of the MultiStepForm component. We reuse the context across steps to manage the form state and transitions between steps.

const MultiStepFormContext = createContext<ReturnType<
  typeof useMultiStepForm
> | null>(null);
To use the context, we create a hook useMultiStepFormContext that returns the context value. If the context is not found, we throw an error:

export function useMultiStepFormContext() {
  const context = useContext(MultiStepFormContext);
  if (!context) {
    throw new Error(
      'useMultiStepFormContext must be used within a MultiStepForm',
    );
  }
  return context;
}
Multi-Step Form Hook
Now comes the most important part of the multi-step form - the useMultiStepForm hook. This hook manages the form state, transitions between steps, and validation of each step.

We will return plenty of properties from the hook, such as the current step, the total number of steps, the current step index, and methods to navigate between steps.

This hook contains the logic to validate each step before moving to the next step. We use the zod schema to validate the form data for each step.

export function useMultiStepForm<Schema extends z.ZodType>(
  schema: Schema,
  form: UseFormReturn<z.infer<Schema>>,
  stepNames: string[],
) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [direction, setDirection] = useState<'forward' | 'backward'>();
  const isStepValid = useCallback(() => {
    const currentStepName = stepNames[currentStepIndex] as Path<
      z.TypeOf<Schema>
    >;
    if (schema instanceof z.ZodObject) {
      const currentStepSchema = schema.shape[currentStepName] as z.ZodType;
      // the user may not want to validate the current step
      // or the step doesn't contain any form field
      if (!currentStepSchema) {
        return true;
      }
      const currentStepData = form.getValues(currentStepName) ?? {};
      const result = currentStepSchema.safeParse(currentStepData);
      return result.success;
    }
    throw new Error(`Unsupported schema type: ${schema.constructor.name}`);
  }, [schema, form, stepNames, currentStepIndex]);
  const nextStep = useCallback(
    <Ev extends React.SyntheticEvent>(e: Ev) => {
      // prevent form submission when the user presses Enter
      // or if the user forgets [type="button"] on the button
      e.preventDefault();
      const isValid = isStepValid();
      if (!isValid) {
        const currentStepName = stepNames[currentStepIndex] as Path<
          z.TypeOf<Schema>
        >;
        if (schema instanceof z.ZodObject) {
          const currentStepSchema = schema.shape[currentStepName] as z.ZodType;
          if (currentStepSchema) {
            const fields = Object.keys(
              (currentStepSchema as z.ZodObject<never>).shape,
            );
            const keys = fields.map((field) => `${currentStepName}.${field}`);
            // trigger validation for all fields in the current step
            for (const key of keys) {
              void form.trigger(key as Path<z.TypeOf<Schema>>);
            }
            return;
          }
        }
      }
      if (isValid && currentStepIndex < stepNames.length - 1) {
        setDirection('forward');
        setCurrentStepIndex((prev) => prev + 1);
      }
    },
    [isStepValid, currentStepIndex, stepNames, schema, form],
  );
  const prevStep = useCallback(<Ev extends React.SyntheticEvent>(e: Ev) => {
    // prevent form submission when the user presses Enter
    // or if the user forgets [type="button"] on the button
    e.preventDefault();
    if (currentStepIndex > 0) {
      setDirection('backward');
      setCurrentStepIndex((prev) => prev - 1);
    }
  }, [currentStepIndex]);
  const goToStep = useCallback(
    (index: number) => {
      if (index >= 0 && index < stepNames.length && isStepValid()) {
        setDirection(index > currentStepIndex ? 'forward' : 'backward');
        setCurrentStepIndex(index);
      }
    },
    [isStepValid, stepNames.length, currentStepIndex],
  );
  const isValid = form.formState.isValid;
  const errors = form.formState.errors;
  return useMemo(
    () => ({
      form,
      currentStep: stepNames[currentStepIndex] as string,
      currentStepIndex,
      totalSteps: stepNames.length,
      isFirstStep: currentStepIndex === 0,
      isLastStep: currentStepIndex === stepNames.length - 1,
      nextStep,
      prevStep,
      goToStep,
      direction,
      isStepValid,
      isValid,
      errors,
    }),
    [
      form,
      isValid,
      errors,
      stepNames,
      currentStepIndex,
      nextStep,
      prevStep,
      goToStep,
      direction,
      isStepValid,
    ],
  );
}
Ok let's go into details of the useMultiStepForm hook:

currentStepIndex - the index of the current step
direction - the direction of the transition between steps
isStepValid - a function that validates the current step using the zod schema. We do so by checking if the current step schema is valid for the current step data.
nextStep - a function that moves to the next step if the current step is valid
prevStep - a function that moves to the previous step
goToStep - a function that moves to a specific step
isValid - a boolean that indicates if the form is valid
errors - an object that contains the form errors
form - the form object returned by useForm
This hook will be reused across the components of the multi-step form to manage the form state and transitions between steps.

Step Transitions
To display a transition between steps, we create a StepTransition component that uses CSS transitions to animate the steps. The StepTransition component receives the isActive and direction props to determine the active step and the direction of the transition.

interface StepTransitionProps {
  direction: 'forward' | 'backward' | undefined;
  isActive: boolean;
}
function StepTransition({
  direction,
  isActive,
  children,
}: React.PropsWithChildren<StepTransitionProps>) {
  const baseClasses = 'transition-all motion-reduce:transition-none duration-300 ease-in-out flex-shrink-0';
  const activeClasses = isActive
    ? 'opacity-100 translate-x-0 h-full'
    : 'opacity-0 pointer-events-none absolute';
  const directionClasses = isActive
    ? ''
    : direction === 'forward'
      ? '-translate-x-full'
      : 'translate-x-full';
  const className = cn(baseClasses, activeClasses, directionClasses);
  return <div className={className}>{children}</div>;
}
Item, Footer and Header
These components are used as slots to render the header, footer, and steps of the multi-step form. They are used to render the header, footer, and steps of the multi-step form. They don't contain logic themselves, but are used so that we can place the item they wrapper in the correct place in the form.

export const MultiStepFormStep = React.forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<
    {
      asChild?: boolean;
    } & HTMLProps<HTMLDivElement>
  >
>(function MultiStepFormStep({ children, asChild, ...props }, ref) {
  const Cmp = asChild ? Slot : 'div';
  return (
    <Cmp ref={ref} {...props}>
      <Slottable>{children}</Slottable>
    </Cmp>
  );
});
export const MultiStepFormHeader = React.forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<
    {
      asChild?: boolean;
    } & HTMLProps<HTMLDivElement>
  >
>(function MultiStepFormHeader({ children, asChild, ...props }, ref) {
  const Cmp = asChild ? Slot : 'div';
  return (
    <Cmp ref={ref} {...props}>
      <Slottable>{children}</Slottable>
    </Cmp>
  );
});
export const MultiStepFormFooter = React.forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<
    {
      asChild?: boolean;
    } & HTMLProps<HTMLDivElement>
  >
>(function MultiStepFormFooter({ children, asChild, ...props }, ref) {
  const Cmp = asChild ? Slot : 'div';
  return (
    <Cmp ref={ref} {...props}>
      <Slottable>{children}</Slottable>
    </Cmp>
  );
});
For example, if the consumer wants to add a header to the multi-step form, they can use the MultiStepFormHeader component:

<MultiStepFormHeader>
  <h1 className="text-2xl font-bold">Create an account</h1>
</MultiStepFormHeader>
Or if they want to use a Stepper component, they can inject the context using the MultiStepFormContextProvider component:

<MultiStepFormHeader>
  <MultiStepFormContextProvider>
    {(ctx) => (
      <Stepper
        currentStep={ctx.currentStepIndex}
        totalSteps={ctx.totalSteps}
      />
    )}
  </MultiStepFormContextProvider>
</MultiStepFormHeader>````
Neat, right? 😎

Multi-Step Form Component
Finally, we can now implement the MultiStepForm component. This component will render the form, header, footer, and steps of the multi-step form. It will also use the useMultiStepForm hook to manage the form state and transitions between steps.

Let's implement the MultiStepForm component:

export function MultiStepForm<T extends z.ZodType>({
  schema,
  form,
  onSubmit,
  children,
  className,
}: React.PropsWithChildren<MultiStepFormProps<T>>) {
  const steps = useMemo(
    () =>
      React.Children.toArray(children).filter(
        (child): child is React.ReactElement<StepProps> =>
          React.isValidElement(child) && child.type === MultiStepFormStep,
      ),
    [children],
  );
  const header = useMemo(() => {
    return React.Children.toArray(children).find(
      (child) =>
        React.isValidElement(child) && child.type === MultiStepFormHeader,
    );
  }, [children]);
  const footer = useMemo(() => {
    return React.Children.toArray(children).find(
      (child) =>
        React.isValidElement(child) && child.type === MultiStepFormFooter,
    );
  }, [children]);
  const stepNames = steps.map((step) => step.props.name);
  const multiStepForm = useMultiStepForm(schema, form, stepNames);
  return (
    <MultiStepFormContext.Provider value={multiStepForm}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(className, 'flex size-full flex-col overflow-hidden')}
      >
        {header}
        <div className="relative transition-transform duration-500">
          {steps.map((step, index) => {
            const isActive = index === multiStepForm.currentStepIndex;
            return (
              <AnimatedStep
                key={step.props.name}
                direction={multiStepForm.direction}
                isActive={isActive}
                index={index}
                currentIndex={multiStepForm.currentStepIndex}
              >
                {step}
              </AnimatedStep>
            );
          })}
        </div>
        {footer}
      </form>
    </MultiStepFormContext.Provider>
  );
}
The createStepSchema function - a helper function to create a schema for each step
To create a schema for each step, we can use the createStepSchema function. This function takes an object of steps and returns a schema for the multi-step form.

It's a simple wrapper around Zod.object that takes an object of steps and returns a schema for the multi-step form:

export function createStepSchema<T extends Record<string, z.ZodType>>(
  steps: T,
) {
  return z.object(steps);
}
And that's it! We now have a multi-step form that allows users to navigate between steps, validate each step, and submit the form. You can use it in your apps using the following React component:

Straight from Makerkit's source code, here is the full code for the MultiStepForm component:

'use client';
import React, {
  HTMLProps,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useEffect,
  useRef,
} from 'react';
import { Slot, Slottable } from '@radix-ui/react-slot';
import { Path, UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { cn } from '../utils';
interface MultiStepFormProps<T extends z.ZodType> {
  schema: T;
  form: UseFormReturn<z.infer<T>>;
  onSubmit: (data: z.infer<T>) => void;
  useStepTransition?: boolean;
  className?: string;
}
type StepProps = React.PropsWithChildren<
  {
    name: string;
    asChild?: boolean;
  } & React.HTMLProps<HTMLDivElement>
>;
const MultiStepFormContext = createContext<ReturnType<
  typeof useMultiStepForm
> | null>(null);
/**
 * @name MultiStepForm
 * @description Multi-step form component for React
 * @param schema
 * @param form
 * @param onSubmit
 * @param children
 * @param className
 * @constructor
 */
export function MultiStepForm<T extends z.ZodType>({
  schema,
  form,
  onSubmit,
  children,
  className,
}: React.PropsWithChildren<MultiStepFormProps<T>>) {
  const steps = useMemo(
    () =>
      React.Children.toArray(children).filter(
        (child): child is React.ReactElement<StepProps> =>
          React.isValidElement(child) && child.type === MultiStepFormStep,
      ),
    [children],
  );
  const header = useMemo(() => {
    return React.Children.toArray(children).find(
      (child) =>
        React.isValidElement(child) && child.type === MultiStepFormHeader,
    );
  }, [children]);
  const footer = useMemo(() => {
    return React.Children.toArray(children).find(
      (child) =>
        React.isValidElement(child) && child.type === MultiStepFormFooter,
    );
  }, [children]);
  const stepNames = steps.map((step) => step.props.name);
  const multiStepForm = useMultiStepForm(schema, form, stepNames);
  return (
    <MultiStepFormContext.Provider value={multiStepForm}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(className, 'flex size-full flex-col overflow-hidden')}
      >
        {header}
        <div className="relative transition-transform duration-500">
          {steps.map((step, index) => {
            const isActive = index === multiStepForm.currentStepIndex;
            return (
              <AnimatedStep
                key={step.props.name}
                direction={multiStepForm.direction}
                isActive={isActive}
                index={index}
                currentIndex={multiStepForm.currentStepIndex}
              >
                {step}
              </AnimatedStep>
            );
          })}
        </div>
        {footer}
      </form>
    </MultiStepFormContext.Provider>
  );
}
export function MultiStepFormContextProvider(props: {
  children: (context: ReturnType<typeof useMultiStepForm>) => React.ReactNode;
}) {
  const ctx = useMultiStepFormContext();
  if (Array.isArray(props.children)) {
    const [child] = props.children;
    return (
      child as (context: ReturnType<typeof useMultiStepForm>) => React.ReactNode
    )(ctx);
  }
  return props.children(ctx);
}
export const MultiStepFormStep = React.forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<
    {
      asChild?: boolean;
    } & HTMLProps<HTMLDivElement>
  >
>(function MultiStepFormStep({ children, asChild, ...props }, ref) {
  const Cmp = asChild ? Slot : 'div';
  return (
    <Cmp ref={ref} {...props}>
      <Slottable>{children}</Slottable>
    </Cmp>
  );
});
export function useMultiStepFormContext<Schema extends z.ZodType>() {
  const context = useContext(MultiStepFormContext) as ReturnType<
    typeof useMultiStepForm<Schema>
  >;
  if (!context) {
    throw new Error(
      'useMultiStepFormContext must be used within a MultiStepForm',
    );
  }
  return context;
}
/**
 * @name useMultiStepForm
 * @description Hook for multi-step forms
 * @param schema
 * @param form
 * @param stepNames
 */
export function useMultiStepForm<Schema extends z.ZodType>(
  schema: Schema,
  form: UseFormReturn<z.infer<Schema>>,
  stepNames: string[],
) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [direction, setDirection] = useState<'forward' | 'backward'>();
  const isStepValid = useCallback(() => {
    const currentStepName = stepNames[currentStepIndex] as Path<
      z.TypeOf<Schema>
    >;
    if (schema instanceof z.ZodObject) {
      const currentStepSchema = schema.shape[currentStepName] as z.ZodType;
      // the user may not want to validate the current step
      // or the step doesn't contain any form field
      if (!currentStepSchema) {
        return true;
      }
      const currentStepData = form.getValues(currentStepName) ?? {};
      const result = currentStepSchema.safeParse(currentStepData);
      return result.success;
    }
    throw new Error(`Unsupported schema type: ${schema.constructor.name}`);
  }, [schema, form, stepNames, currentStepIndex]);
  const nextStep = useCallback(
    <Ev extends React.SyntheticEvent>(e: Ev) => {
      // prevent form submission when the user presses Enter
      // or if the user forgets [type="button"] on the button
      e.preventDefault();
      const isValid = isStepValid();
      if (!isValid) {
        const currentStepName = stepNames[currentStepIndex] as Path<
          z.TypeOf<Schema>
        >;
        if (schema instanceof z.ZodObject) {
          const currentStepSchema = schema.shape[currentStepName] as z.ZodType;
          if (currentStepSchema) {
            const fields = Object.keys(
              (currentStepSchema as z.ZodObject<never>).shape,
            );
            const keys = fields.map((field) => `${currentStepName}.${field}`);
            // trigger validation for all fields in the current step
            for (const key of keys) {
              void form.trigger(key as Path<z.TypeOf<Schema>>);
            }
            return;
          }
        }
      }
      if (isValid && currentStepIndex < stepNames.length - 1) {
        setDirection('forward');
        setCurrentStepIndex((prev) => prev + 1);
      }
    },
    [isStepValid, currentStepIndex, stepNames, schema, form],
  );
  const prevStep = useCallback(
    <Ev extends React.SyntheticEvent>(e: Ev) => {
      // prevent form submission when the user presses Enter
      // or if the user forgets [type="button"] on the button
      e.preventDefault();
      if (currentStepIndex > 0) {
        setDirection('backward');
        setCurrentStepIndex((prev) => prev - 1);
      }
    },
    [currentStepIndex],
  );
  const goToStep = useCallback(
    (index: number) => {
      if (index >= 0 && index < stepNames.length && isStepValid()) {
        setDirection(index > currentStepIndex ? 'forward' : 'backward');
        setCurrentStepIndex(index);
      }
    },
    [isStepValid, stepNames.length, currentStepIndex],
  );
  const isValid = form.formState.isValid;
  const errors = form.formState.errors;
  return useMemo(
    () => ({
      form,
      currentStep: stepNames[currentStepIndex] as string,
      currentStepIndex,
      totalSteps: stepNames.length,
      isFirstStep: currentStepIndex === 0,
      isLastStep: currentStepIndex === stepNames.length - 1,
      nextStep,
      prevStep,
      goToStep,
      direction,
      isStepValid,
      isValid,
      errors,
    }),
    [
      form,
      stepNames,
      currentStepIndex,
      nextStep,
      prevStep,
      goToStep,
      direction,
      isStepValid,
      isValid,
      errors,
    ],
  );
}
export const MultiStepFormHeader = React.forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<
    {
      asChild?: boolean;
    } & HTMLProps<HTMLDivElement>
  >
>(function MultiStepFormHeader({ children, asChild, ...props }, ref) {
  const Cmp = asChild ? Slot : 'div';
  return (
    <Cmp ref={ref} {...props}>
      <Slottable>{children}</Slottable>
    </Cmp>
  );
});
export const MultiStepFormFooter = React.forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<
    {
      asChild?: boolean;
    } & HTMLProps<HTMLDivElement>
  >
>(function MultiStepFormFooter({ children, asChild, ...props }, ref) {
  const Cmp = asChild ? Slot : 'div';
  return (
    <Cmp ref={ref} {...props}>
      <Slottable>{children}</Slottable>
    </Cmp>
  );
});
/**
 * @name createStepSchema
 * @description Create a schema for a multi-step form
 * @param steps
 */
export function createStepSchema<T extends Record<string, z.ZodType>>(
  steps: T,
) {
  return z.object(steps);
}
interface AnimatedStepProps {
  direction: 'forward' | 'backward' | undefined;
  isActive: boolean;
  index: number;
  currentIndex: number;
}
function AnimatedStep({
  isActive,
  direction,
  children,
  index,
  currentIndex,
}: React.PropsWithChildren<AnimatedStepProps>) {
  const [shouldRender, setShouldRender] = useState(isActive);
  const stepRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (isActive) {
      setShouldRender(true);
    } else {
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isActive]);
  useEffect(() => {
    if (isActive && stepRef.current) {
      const focusableElement = stepRef.current.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusableElement) {
        (focusableElement as HTMLElement).focus();
      }
    }
  }, [isActive]);
  if (!shouldRender) {
    return null;
  }
  const baseClasses =
    ' top-0 left-0 w-full h-full transition-all duration-300 ease-in-out animate-in fade-in zoom-in-95';
  const visibilityClasses = isActive ? 'opacity-100' : 'opacity-0 absolute';
  const transformClasses = cn('translate-x-0', isActive ? {} : {
    '-translate-x-full': direction === 'forward' || index < currentIndex,
    'translate-x-full': direction === 'backward' || index > currentIndex,
  });
  const className = cn(baseClasses, visibilityClasses, transformClasses);
  return (
    <div ref={stepRef} className={className} aria-hidden={!isActive}>
      {children}
    </div>
  );
}
Conclusion
In this article, we explained how to build Multi-Step forms with Next.js and the library react-hook-form. We also used the Zod library for schema validation and Shadcn UI for styling.

You can now sue this component in your apps to create multi-step forms that allow users to navigate between steps, validate each step, and submit the form.

I hope you found this article helpful. Happy coding! 🚀
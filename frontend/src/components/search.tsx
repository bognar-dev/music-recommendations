'use client';

import Form from 'next/form';
import { useFormStatus } from 'react-dom';
import { useRef, use, useEffect, useState } from 'react';
import { SearchIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useSearchParams } from 'next/navigation';
import { useBackpressure } from '@/lib/use-backpressure';

function SearchBase({ initialQuery }: { initialQuery: string }) {
  const [inputValue, setInputValue] = useState(initialQuery);
  const inputRef = useRef<HTMLInputElement>(null);
  const { triggerUpdate, shouldSuspend, formRef } = useBackpressure();
  const searchParams = useSearchParams();

  async function handleSubmit(formData: FormData) {
    const query = formData.get('search') as string;
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('search', query);
    // Remove the page parameter if it's 1 or empty
    if (!newSearchParams.get('page') || newSearchParams.get('page') === '1') {
      newSearchParams.delete('page');
    }
    const newUrl = `/songs?${newSearchParams.toString()}`;
    await triggerUpdate(newUrl);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newValue = e.target.value;
    setInputValue(newValue);
    formRef.current?.requestSubmit();
  }

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.setSelectionRange(
        inputRef.current.value.length,
        inputRef.current.value.length
      );
    }
  }, []);

  if (shouldSuspend) {
    use(Promise.resolve());
  }

  return (
    <Form
      ref={formRef}
      action={handleSubmit}
      className="relative flex flex-1 flex-shrink-0 w-full rounded shadow-sm"
    >
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        ref={inputRef}
        onChange={handleInputChange}
        type="text"
        name="search"
        id="search"
        placeholder="Search songs..."
        value={inputValue}
        className="w-full border-0 px-10 py-6 text-base md:text-sm overflow-hidden focus-visible:ring-0"
      />
      <LoadingSpinner />
    </Form>
  );
}

function LoadingSpinner() {
  const { pending } = useFormStatus();

  return (
    <div
      data-pending={pending ? '' : undefined}
      className="absolute right-3 top-1/2 -translate-y-1/2 transition-opacity duration-300"
    >
      <svg className="h-5 w-5" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="currentColor"
          strokeWidth="10"
          strokeDasharray="282.7"
          strokeDashoffset="282.7"
          className={pending ? 'animate-fill-clock' : ''}
          transform="rotate(-90 50 50)"
        />
      </svg>
    </div>
  );
}

export function SearchFallback() {
  return <SearchBase initialQuery="" />;
}

export function Search() {
  const query = useSearchParams().get('search') ?? '';
  return <SearchBase initialQuery={query} />;
}

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createFormHook, createFormHookContexts } from '@tanstack/react-form';

const { fieldContext, formContext } = createFormHookContexts();

const { useAppForm } = createFormHook({
  fieldComponents: {
    Input,
  },
  formComponents: {
    Button,
  },
  fieldContext,
  formContext,
});

export { useAppForm };

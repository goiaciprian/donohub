import { useMutation, useQuery } from '@tanstack/react-query';
import { getTestRequest, postTestRequest } from '@/support';
import { useAuth } from '@clerk/clerk-react';
import { useAuthRequest } from '../hooks/useAuthRequest';
import { PostTestDto } from '@donohub/shared';
import { useAppForm } from '@/support/form';
import { Label } from '@/components/ui/label';

export function App() {
  const { isSignedIn } = useAuth();

  const getTestFn = useAuthRequest(getTestRequest);
  const testQuery = useQuery({
    queryFn: () => getTestFn({}),
    queryKey: ['test', isSignedIn],
    enabled: isSignedIn,
  });

  const postTestFn = useAuthRequest(postTestRequest);
  const postTestMutation = useMutation({
    mutationFn: (body: PostTestDto) => postTestFn({ body }),
  });

  const form = useAppForm({
    defaultValues: {
      message: '',
    },
    onSubmit: ({ value }) => {
      postTestMutation.mutate({ message: value.message });
    },
  });

  return (
    <>
      <div>
        {testQuery.data?.message}{' '}
        <button onClick={() => testQuery.refetch()}>Refetch</button>
      </div>
      <div>
        <form
          className="flex flex-col w-1/12 gap-2 items-center"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <form.AppField
            name="message"
            children={(field) => (
              <>
                <Label htmlFor={field.name} className="text-md self-start">
                  Message
                </Label>
                <field.Input id={field.name} type="text" />
              </>
            )}
          />
          <form.AppForm>
            <form.Button type="submit">Submit</form.Button>
          </form.AppForm>
        </form>
      </div>
      <div>{postTestMutation.data?.message} from post response</div>
    </>
  );
}

export default App;

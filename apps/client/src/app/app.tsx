import { useMutation, useQuery } from '@tanstack/react-query';
import { getTestRequest, postTestRequest } from '../support';
import {
  SignedOut,
  SignInButton,
  SignUpButton,
  SignedIn,
  UserButton,
  useAuth,
} from '@clerk/clerk-react';
import { useAuthRequest } from '../hooks/useAuthRequest';
import { PostTestDto } from '../../../../packages/shared/src/lib/shared';

export function App() {

  const { isSignedIn } = useAuth();

  const getTestFn = useAuthRequest(getTestRequest);
  const testQuery = useQuery({
    queryFn: () => getTestFn({}),
    queryKey: ['test', isSignedIn],
    enabled: isSignedIn
  });

  const postTestFn = useAuthRequest(postTestRequest);
  const postTestMutation = useMutation({
   mutationFn: (body: PostTestDto) => postTestFn({ body })
  })

  return (
    <>
      <div >{testQuery.data?.message} <button onClick={() => testQuery.refetch()}>Refetch</button></div>
      <div className='flex w-full bg-red-400'>
        <SignedOut>
          <div>
            <SignInButton />
            <SignUpButton />
          </div>
        </SignedOut>
        <SignedIn>
          <div>
            <UserButton />
          </div>
        </SignedIn>
      </div>
      <div>
        <form onSubmit={(e) => {
          e.preventDefault()
          const message = e.currentTarget.elements?.message?.value
          postTestMutation.mutate({ message, })
        }}>
          <div>
            <label htmlFor='message'>Message</label>
            <input id='message' />
          </div>
          <button type='submit'>SEnd</button>
        </form>
      </div>
    </>
  );
}

export default App;

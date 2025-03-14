import { useMutation, useQuery } from '@tanstack/react-query';
import { getTestRequest, postTestRequest } from '../support';
import {
  useAuth,
} from '@clerk/clerk-react';
import { useAuthRequest } from '../hooks/useAuthRequest';
import { PostTestDto } from '@donohub/shared';

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
      <div className='bg-mint-500'>
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
      <div>
        {postTestMutation.data?.message} from post response 
      </div>
    </>
  );
}

export default App;

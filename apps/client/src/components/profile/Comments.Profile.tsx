import { Page } from '../pages/Page';
import { UserComments } from '../User.Comments';

export const CommentsProfile = () => {
  return (
    <Page
      className="lg:md:mx-[5%] select-none"
      staticFirst={<h1 className="font-bold py-5 text-3xl">Comments</h1>}
      dynamicComponent={<UserComments />}
    />
  );
};

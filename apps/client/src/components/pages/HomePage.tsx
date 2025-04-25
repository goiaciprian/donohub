import { useAuthRequest } from '@/hooks/useAuthRequest';
import { getLatestDonations } from '@/support';
import { usePrefetchQuery } from '@tanstack/react-query';
import { Page } from './Page';
import { SignInButton } from '../buttons/SignInButton';
import { SignUpButton } from '../buttons/SignUpButton';
import LatestDonationsHome from '../LatestDonations.Home';

export const HomePage = () => {
  const getLatestDonationsFn = useAuthRequest(getLatestDonations);
  usePrefetchQuery({
    queryKey: ['home', 'latest-donations'],
    queryFn: () => getLatestDonationsFn({ params: { page: 1, size: 5 } }),
  });

  return (
    <Page
      staticFirst={
        <section className="relative w-full h-[90vh] bg-[url(/assets/home1.jpg)] bg-cover bg-top-left bg-blend-overlay bg-gray-700">
          <div className="absolute text-white h-[90vh] w-full pt-5">
            <h1 className="text-4xl text-center font-bold">
              Da mai departe ce nu mai folosesti
            </h1>
            <h2 className="text-4xl max-w-3xl text-center pt-20 ml-20 font-bold">
              Transforma lucrurile de care nu mai ai nevoie în oportunitati
              pentru altii. Doneaza, primeste si construieste o comunitate mai
              buna.
            </h2>
            <div className="absolute bottom-80 left-[80%]">
              <h2 className="text-4xl font-bold pb-3">
                Logheaza-te si doneaza acum
              </h2>
              <div className="flex flex-row w-full justify-between">
                <SignInButton className="text-4xl font-bold cursor-pointer" />
                <p className="text-4xl font-bold">sau</p>
                <SignUpButton className="text-4xl font-bold cursor-pointer" />
              </div>
            </div>
          </div>
        </section>
      }
      dynamicComponent={<LatestDonationsHome />}
      staticSecond={
        <>
          <section className="bg-gray-800 text-white mt-30 pb-20">
            <div className="py-20">
              <h3 className="text-4xl font-bold text-center pb-5">
                Cum functioneaza?
              </h3>
              <h5 className="font-bold italic text-3xl text-center">
                4 pasi simpli
              </h5>
            </div>
            <div className="text-3xl text-white text-center">
              <ol className="list-inside list-decimal italic *:not-last:mb-10">
                <li>Te conectezi sau iti faci un cont</li>
                <li>Adaugi o donatie</li>
                <li>
                  Astepti o notificare de la noi cand cineva este intersesat
                </li>
                <li>Stabilesti modul de livrare</li>
              </ol>
            </div>
          </section>
          <section className="mt-20 text-center w-fit m-auto pb-20">
            <h3 className="text-4xl font-bold text-center py-10">
              Găsește bucuria de a dărui și de a primi gratuit!
            </h3>
            <div className="flex flex-row w-full justify-evenly">
              <SignInButton className="text-4xl font-bold cursor-pointer" />
              <p className="text-4xl font-bold">sau</p>
              <SignUpButton className="text-4xl font-bold cursor-pointer" />
            </div>
          </section>
        </>
      }
    />
  );
};

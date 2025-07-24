import { ReactNode, Suspense } from 'react';
import ThemeBtn from '@/components/theming/themeBtn';
import { House } from 'lucide-react';

export default function AuthenticationLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className='flex h-[100vh] w-[100vw]'>
      <div className='bg-zinc-900 h-[100%] w-[50%] flex-col p-8 text-white dark:border-r space-y-2 hidden sm:flex'>
        <div className='flex space-x-3 items-center'>
          <House />
          <h1 className='text-lg font-medium'>cooper</h1>
        </div>
        <div className='grow'></div>
        <p className='text-lg'>Home resource management made easy</p>
        <p className='text-sm'>by Ian Yeoh</p>
      </div>
      <div className='relative bg-background h-[100%] sm:w-[50%] w-full flex flex-col items-center justify-center p-8'>
        <div className='absolute flex sm:hidden top-7 justify-center px-9 w-screen'>
          <div className='flex space-x-3 items-center'>
            <House />

            <h1 className='text-lg font-medium'>cooper</h1>
          </div>
          <ThemeBtn className='ml-auto' />
        </div>

        <div className='space-y-6 mx-6'>
          <ThemeBtn className='absolute top-7 right-9 hidden sm:flex' />

          <Suspense>{children}</Suspense>
        </div>
      </div>
    </div>
  );
}

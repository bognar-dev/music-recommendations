'use client';
import { AddDealRoutes } from '@/types/survey';
import clsx from 'clsx';
import { ArrowBigLeftIcon, ArrowBigRightIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import path from 'path';
import { useEffect, useState } from 'react';

const steps = [
    {
        title: 'Model 1',
        route: 'step-one',
        link: AddDealRoutes.MODEL_1,
    },
    {
        title: 'Model 2',
        route: 'step-two',
        link: AddDealRoutes.MODEL_2,
    },
    {
        title: 'Model 3',
        route: 'step-three',
        link: AddDealRoutes.MODEL_3,
    },
    { title: 'Review', route: 'review', link: AddDealRoutes.REVIEW_SURVEY },
];

export default function StepNavigation() {
    const pathname = usePathname();
    const currentPath = path.basename(pathname);
    const [currentStep, setCurrentStep] = useState(1);
    useEffect(() => {
        setCurrentStep(steps.findIndex((step) => step.route === currentPath));
    }, [currentPath]);

    return (
        <div className="mb-12 mt-4 min-w-60">



            {/* list of form steps */}
            <div className=" flex justify-center justify-items-center lg:gap-8">
                <Link
                    href={steps[currentStep - 1]?.link || steps[3].link}    
                    className={clsx(
                        'flex h-10 w-10 items-center justify-center rounded-full border  text-sm  transition-colors duration-200  lg:h-12 lg:w-12 lg:text-lg',
                        'border-none bg-accent text-foreground group-hover:border-none group-hover:text-foreground'
                    )}
                >
                    <ArrowBigLeftIcon className="h-6 w-6" />
                </Link>
                {steps.map((step, i) => (
                    <Link
                        href={step.link}
                        key={step.link}
                        className="group z-20 flex items-center gap-3 text-2xl"
                        prefetch={true}
                    >
                        <span
                            className={clsx(
                                'flex h-10 w-10 items-center justify-center rounded-full border  text-sm  transition-colors duration-200  lg:h-12 lg:w-12 lg:text-lg',
                                {
                                    'border-none bg-accent text-foreground group-hover:border-none group-hover:text-background':
                                        currentPath === step.route,
                                    'border-white/75 bg-foreground text-background group-hover:border-white group-hover:text-background':
                                        currentPath !== step.route,
                                }
                            )}
                        >
                            {i + 1}
                        </span>
                        <span
                            className={clsx(
                                'hidden text-foreground/75 transition-colors duration-200 group-hover:text-primary-foreground group-hover:dark:text-foreground lg:block',
                                {
                                    'font-light': currentPath !== step.route,
                                    'font-light text-primary-foreground dark:text-foreground': currentPath === step.route,
                                }
                            )}
                        >
                            {step.title}
                        </span>
                    </Link>
                ))}
                <Link
                    href={steps[currentStep + 1]?.link || steps[0].link}    
                    className={clsx(
                        'flex h-10 w-10 items-center justify-center rounded-full border  text-sm  transition-colors duration-200  lg:h-12 lg:w-12 lg:text-lg',
                        'border-none bg-accent text-foreground group-hover:border-none group-hover:text-foreground'
                    )}
                >
                    <ArrowBigRightIcon className="h-6 w-6" />
                </Link>
                {/* mobile background dashes */}
                <div className="absolute top-4 flex h-1 w-full border-b border-dashed lg:hidden" />
            </div>
        </div>
    );
}
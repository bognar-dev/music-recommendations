'use client';
import { AddDealRoutes } from '@/types/survey';
import clsx from 'clsx';
import { ArrowBigLeftIcon, ArrowBigRightIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Progress } from './ui/progress';

export default function StepNavigation() {
    const t = useTranslations('Survey.steps');
    const pathname = usePathname();
    const currentPath = pathname;

    // Define the steps with their major/minor status
    const steps = [
        {
            major: true,
            title: t('model1'),
            route: 'step-one',
            link: AddDealRoutes.MODEL_1,
            index: 1,
        },
        {
            major: false,
            title: t('playlist1'),
            link: AddDealRoutes.M_1_P1,
            parentIndex: 1,
            subIndex: 1,
        },
        {
            major: false,
            title: t('playlist2'),
            link: AddDealRoutes.M_1_P2,
            parentIndex: 1,
            subIndex: 2,
        },
        {
            major: false,
            title: t('playlist3'),
            link: AddDealRoutes.M_1_P3,
            parentIndex: 1,
            subIndex: 3,
        },
        {
            major: true,
            title: t('model2'),
            route: 'step-two',
            link: AddDealRoutes.MODEL_2,
            index: 2,
        },
        {
            major: false,
            title: t('playlist1'),
            link: AddDealRoutes.M_2_P1,
            parentIndex: 2,
            subIndex: 1,
        },
        {
            major: false,
            title: t('playlist2'),
            link: AddDealRoutes.M_2_P2,
            parentIndex: 2,
            subIndex: 2,
        },
        {
            major: false,
            title: t('playlist3'),
            link: AddDealRoutes.M_2_P3,
            parentIndex: 2,
            subIndex: 3,
        },
        {
            major: true,
            title: t('model3'),
            route: 'step-three',
            link: AddDealRoutes.MODEL_3,
            index: 3,
        },
        {
            major: false,
            title: t('playlist1'),
            link: AddDealRoutes.M_3_P1,
            parentIndex: 3,
            subIndex: 1,
        },
        {
            major: false,
            title: t('playlist2'),
            link: AddDealRoutes.M_3_P2,
            parentIndex: 3,
            subIndex: 2,
        },
        {
            major: false,
            title: t('playlist3'),
            link: AddDealRoutes.M_3_P3,
            parentIndex: 3,
            subIndex: 3,
        },
        {
            major: true,
            title: t('review'),
            route: 'review',
            link: AddDealRoutes.REVIEW_SURVEY,
            index: 4,
        },
    ];

    // Find current step index
    const currentStepIndex = steps.findIndex((step) => step.link === currentPath);

    // Get previous and next links
    const prevLink = currentStepIndex > 0
        ? steps[currentStepIndex - 1].link
        : steps[steps.length - 1].link;

    const nextLink = currentStepIndex < steps.length - 1
        ? steps[currentStepIndex + 1].link
        : steps[0].link;

    // Group steps by parent for better rendering
    const majorSteps = steps.filter(step => step.major);

    // Check if a step or its children are active
    const isActiveParent = (parentIndex: number | undefined) => {
        const currentStep = steps[currentStepIndex];
        return currentStep && (
            (currentStep.major && currentStep.index === parentIndex) ||
            (!currentStep.major && currentStep.parentIndex === parentIndex)
        );
    };

    return (
        <div className="mb-12 mt-4 min-w-60">
            <div className="flex flex-col items-center space-y-6">
                {/* Progress indicator */}
        <Progress value={((currentStepIndex + 1) / steps.length) * 100} className="px-5 h-1 w-44 md:w-full max-w-xl" />
                {/* Main navigation */}
                <div className="flex items-center justify-center gap-2 lg:gap-4">
                    {/* Previous button */}
                    <Link
                        href={prevLink}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-background hover:bg-accent/90 transition-colors duration-200 lg:h-12 lg:w-12"
                    >
                        <ArrowBigLeftIcon className="h-6 w-6 stroke-1" />
                    </Link>

                    {/* Major steps with their playlists */}
                    <div className="flex items-start gap-1 lg:gap-6">
                        {majorSteps.map((majorStep) => {
                            const isActive = isActiveParent(majorStep.index);
                            const childSteps = steps.filter(
                                step => !step.major && step.parentIndex === majorStep.index
                            );

                            return (
                                <div key={majorStep.link} className="flex flex-col items-center ">
                                    {/* Major step */}
                                    <Link
                                        href={majorStep.link}
                                        className="group flex items-center gap-3"
                                        prefetch={true}
                                    >
                                        <span
                                            className={clsx(
                                                'flex h-10 w-10 items-center justify-center rounded-full border text-sm transition-colors duration-200 lg:h-12 lg:w-12',
                                                {
                                                    'border-none bg-accent text-background': isActive,
                                                    'border-accent/20 bg-background text-foreground hover:border-accent/50': !isActive,
                                                }
                                            )}
                                        >
                                            {majorStep.index}
                                        </span>
                                        <span
                                            className={clsx(
                                                'hidden text-sm transition-colors duration-200 lg:block',
                                                {
                                                    'font-medium text-foreground': isActive,
                                                    'font-light text-foreground/75 group-hover:text-foreground/90': !isActive,
                                                }
                                            )}
                                        >
                                            {majorStep.title}
                                        </span>
                                    </Link>

                                    {/* Playlist steps */}
                                    {childSteps.length > 0 && (
                                        <div className="mt-3 flex space-x-3">
                                            {childSteps.map((childStep) => {
                                                const isChildActive = currentPath === childStep.link;

                                                return (
                                                    <Link
                                                        key={childStep.link}
                                                        href={childStep.link}
                                                        prefetch={true}
                                                        className={clsx(
                                                            "flex flex-col items-center transition-opacity duration-200",
                                                            {
                                                                "opacity-100": isActive,
                                                                "opacity-40 hover:opacity-70": !isActive
                                                            }
                                                        )}
                                                    >
                                                        <div
                                                            className={clsx(
                                                                "flex md:h-6 md:w-6 size-4 items-center justify-center rounded-full text-xs",
                                                                {
                                                                    "bg-accent/80 text-background ": isChildActive,
                                                                    "bg-accent/20 text-foreground/80 hover:bg-accent/30": !isChildActive && isActive,
                                                                    "bg-accent/10 text-foreground/60": !isChildActive && !isActive
                                                                }
                                                            )}
                                                        >
                                                            {childStep.subIndex}
                                                        </div>
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Next button */}
                    <Link
                        href={nextLink}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-background hover:bg-accent/90 transition-colors duration-200 lg:h-12 lg:w-12"
                    >
                        <ArrowBigRightIcon className="h-6 w-6 stroke-1" />
                    </Link>
                </div>


            </div>
        </div>
    );
}

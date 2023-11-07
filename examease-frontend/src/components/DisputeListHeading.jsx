import { Fragment } from 'react'
import {
    BriefcaseIcon,
    CalendarIcon,
    CheckIcon,
    ChevronDownIcon,
    CurrencyDollarIcon,
    LinkIcon,
    MapPinIcon,
    PencilIcon,
} from '@heroicons/react/20/solid'
import { Menu, Transition } from '@headlessui/react'
import DisputeTabs from './DisputeTabs'

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function DisputeListHeading() {
    return (
        <div className="space-y-2">
            <div className="min-w-0 flex-1">
                <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                    Disputes
                </h2>
            </div>
        </div>
    )
}

/* This example requires Tailwind CSS v2.0+ */
import { useEffect, useState } from 'react'
import { Switch } from '@headlessui/react'

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function ToggleView({ getter }) {
    const [enabled, setEnabled] = useState(true);

    useEffect(() => {
        getter(enabled);
    }, [enabled])

    return (
        <div className="grid grid-cols-1 mt-4 sm:mx-8 mx-4">
            <div className="col-start-2 col-end-2">
                <p className="text-md font-medium text-gray-700">Toggle view</p>
                <Switch.Group as="div" className="flex items-center mt-1">
                    <Switch.Label as="span" className="mr-3">
                        <span className="text-sm font-medium text-gray-900">Student</span>
                    </Switch.Label>
                    <Switch
                        checked={enabled}
                        onChange={setEnabled}
                        className={classNames(
                            enabled ? 'bg-indigo-600' : 'bg-gray-200',
                            'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                        )}
                    >
                        <span
                            aria-hidden="true"
                            className={classNames(
                                enabled ? 'translate-x-5' : 'translate-x-0',
                                'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                            )}
                        />
                    </Switch>
                    <Switch.Label as="span" className="ml-3">
                        <span className="text-sm font-medium text-gray-900">Faculty</span>
                    </Switch.Label>
                </Switch.Group>
            </div>
        </div>
    )
}

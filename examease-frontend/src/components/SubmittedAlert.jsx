/* This example requires Tailwind CSS v2.0+ */
import { CheckCircleIcon } from '@heroicons/react/20/solid'

export default function SubmittedAlert() {
    return (
        <div className="rounded-md bg-green-100 p-4">
            <div className="flex">
                <div className="flex-shrink-0">
                    <CheckCircleIcon className="h-5 w-5 text-green-500" aria-hidden="true" />
                </div>
                <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">Successfully submitted</h3>
                    <div className="mt-2 text-sm text-green-700">
                        <p>Your exam is submitted successfully. Scores will be sent to your email soon.</p>
                    </div>

                </div>
            </div>
        </div>
    )
}

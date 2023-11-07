import moment from "moment"
import { Link } from "react-router-dom"


function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function DisputeList({ disputes }) {
    return (
        <div className="">
            {disputes && disputes.map((dispute, disputeIdx) => (
                <Link key={dispute.disputeIdx} to={`/dispute/view?ans=${dispute.studentPaper}`} state={{ dispute: dispute }} >
                    <div key={dispute.disputeIdx} className="flex space-x-4 text-sm text-gray-500">
                        <div className="flex-none py-10">
                            <img src={"https://e7.pngegg.com/pngimages/442/17/png-clipart-computer-icons-user-profile-male-user-heroes-head.png"} alt="" className="h-10 w-10 rounded-full bg-gray-100" />
                        </div>
                        <div className={classNames(disputeIdx === 0 ? '' : 'border-t border-gray-200', 'flex-1 py-10')}>
                            <div className="flex flex-row items-center space-x-2">
                                <h3 className="font-medium text-gray-900">{dispute.studentName}</h3>
                                <div>
                                    {dispute.resolved ?
                                        <span className="inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-800">
                                            Resolved
                                        </span>
                                        :
                                        <></>
                                    }
                                </div>

                            </div>

                            <p>{dispute.examTitle}</p>
                            {/* <h3 className="font-medium text-gray-600">{"CSE 327.1"}</h3> */}
                            <p>
                                {/* <time dateTime={dispute.datetime}>{dispute.date}</time> */}
                            </p>
                            <p className="mb-2">{moment(new Date(dispute.createdAt)).from(new Date())}</p>
                            <p className="font-medium text-md text-gray-900">{dispute.subject}</p>

                            <div
                                className="prose prose-sm mt-2 max-w-none text-gray-500"
                                dangerouslySetInnerHTML={{ __html: dispute.studentComment }}
                            />
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    )
}

import { CheckIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { useEffect, useState } from "react"

/*
  This example requires Tailwind CSS v2.0+ 
  
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/
const people = [
    { id: 1, name: 'Annette Black' },
    { id: 2, name: 'Cody Fisher' },
    { id: 3, name: 'Courtney Henry' },
    { id: 4, name: 'Kathryn Murphy' },
    { id: 5, name: 'Theresa Webb' },
]

export default function ListOptions({ title, options, defaultAnswer, correctAnswers, getter, graded, submitted }) {

    const [answers, setAnswers] = useState("");


    useEffect(() => {
        setAnswers(defaultAnswer ? defaultAnswer : "0".repeat(options.length));
        getter(answers);
    }, [])
    useEffect(() => {
        getter(answers);
    }, [answers])


    const toggleCheckbox = (index) => {
        let cur = answers;
        cur = cur.split('');
        cur[index] = (cur[index] === "1" ? "0" : "1");
        cur = cur.join('');
        setAnswers(cur);
    }

    return (
        <div className="flex flex-col space-y-4 mt-4">
            <p className="text-md leading-6 text-gray-700">{title}</p>
            <fieldset className="space-y-5">
                {/* <legend className="sr-only">Notifications</legend> */}


                {options && options.map((people, idx) => (
                    <div key={idx} className="relative flex items-start">
                        <div className="flex h-5 items-center">
                            <input
                                id={`option${idx}`}
                                aria-describedby="comments-description"
                                name={`option${idx}`}
                                type="checkbox"
                                onChange={() => submitted ? {} : toggleCheckbox(idx)}
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                checked={answers && answers.charAt(idx) === "1"}
                            />
                        </div>
                        <div className="ml-3 text-sm">
                            <label htmlFor="comments" className="font-medium text-gray-700">
                                {people}
                            </label>
                        </div>
                        <div className="ml-2">
                            {correctAnswers && correctAnswers.charAt(idx) === "1" ? <CheckIcon className="text-green-500 h-5 w-5" /> :
                                correctAnswers && correctAnswers.charAt(idx) === "0" && answers && answers.charAt(idx) === "1" ?
                                    <XMarkIcon className="text-red-500 h-5 w-5" />
                                    :
                                    <></>
                            }
                        </div>

                    </div>
                ))}


            </fieldset>
        </div>
    )
}

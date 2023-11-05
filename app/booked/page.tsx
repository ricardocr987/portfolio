type SearchParamsProps = {
    url: string
}

export default function Page({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    return (
        <div className="py-8 sm:py-16 mx-auto max-w-xl">
            <h1 className="text-3xl font-bold tracking-tight text-accent-700">
                The appointment has been confirmed.
            </h1>
            <p className="mt-6 text-xl text-gray-800 font-medium">
                It’s now on your calendar and an invite has been sent to them.{" "}
                <a
                    href={"https://www.google.com/calendar/event?eid=" + searchParams.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-700 underline">
                    View it on Google Calendar
                </a>
            </p>
        </div>
    )
}

type SearchParamsProps = {
    url: string
}

export default function Page({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    return (
        <div className="py-16 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-accent-700 underline">
                The appointment has been confirmed.
            </h1>
            <p className="mt-6 text-xl font-medium">
                You got an email with the Google Calendar event.
            </p>
        </div>
    )
}

function DayNames() {
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    return (         
        <tr>
            {dayNames.map((name) => (
                <th key={name}>
                    <div className="w-full flex justify-center">
                        <p className="text-base font-medium text-center text-gray-800 dark:text-gray-100">{name}</p>
                    </div>
                </th>
            ))}
        </tr>
    );
}

export default DayNames;

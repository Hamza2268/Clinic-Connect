import { changeColors } from '../../MockInfo';

export default function StatCard({
    title,
    value,
    change,
    changeType = 'neutral',
    icon,
    // Updated default prop to use specific HSL value for primary color
    iconBgClass = 'bg-[hsl(174,62%,40%)]/10',
}) {

    return (
        <div className="bg-[hsl(0,0%,100%)] rounded-xl border border-[hsl(215,20%,88%)] p-6 transition-all duration-300 
            shadow-[0_1px_2px_0_hsl(215,25%,15%,0.05)] 
            hover:shadow-[0_10px_15px_-3px_hsl(215,25%,15%,0.1),0_4px_6px_-4px_hsl(215,25%,15%,0.1)] 
            hover:-translate-y-0.5"
        >
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-[hsl(215,15%,50%)] text-sm font-medium mb-1">{title}</p>
                    <p className="text-3xl font-bold text-[hsl(215,25%,15%)] font-['Poppins']">{value}</p>
                    {change && (
                        /* Note: If 'changeColors' (from MockInfo) uses custom classes like 'text-success', 
                           you may need to update that file or override them here. 
                           Assuming they are standard classes like 'text-green-500' for now.
                        */
                        <p className={`text-sm mt-2 font-medium ${changeColors[changeType]}`}>
                            {change}
                        </p>
                    )}
                </div>
                <div className={`p-3 rounded-xl ${iconBgClass}`}>
                    {icon}
                </div>
            </div>
        </div>
    );
}
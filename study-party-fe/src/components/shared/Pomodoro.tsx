import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Pause, Play, RotateCcw, Timer} from "lucide-react";
import {Progress} from "@/components/ui/progress.tsx";
import {Button} from "@/components/ui/button.tsx";
import usePomodoro from "@/hooks/use-poromodo.ts";

const Pomodoro = ({title}: {title: string}) => {
    const pomo = usePomodoro();

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2"><Timer className="h-5 w-5"/>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col items-center justify-center gap-4 py-2">
                    <div className="text-5xl font-bold tabular-nums">{pomo.leftLabel}</div>
                    <Progress value={pomo.percent} className="w-full"/>
                    <div className="flex flex-wrap items-center gap-2">
                        {!pomo.running ? (
                            <Button onClick={pomo.start} className="gap-2"><Play className="h-4 w-4"/>Bắt
                                đầu</Button>
                        ) : (
                            <Button onClick={pomo.pause} variant="secondary" className="gap-2"><Pause
                                className="h-4 w-4"/>Tạm dừng</Button>
                        )}
                        <Button onClick={() => pomo.reset()} variant="outline" className="gap-2"><RotateCcw
                            className="h-4 w-4"/>Reset</Button>
                        <Button onClick={pomo.set25} variant="outline">25'</Button>
                        <Button onClick={pomo.set50} variant="outline">50'</Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default Pomodoro;
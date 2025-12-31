import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {NativeSelect, NativeSelectOption} from "@/components/ui/native-select.tsx";
import {useEffect, useState} from "react";
import CopyBox from "@/components/CopyBox.tsx";
import { toast } from "sonner"
import {createShortUrl, deleteShortUrl, getShortUrlStats, updateOriginaltUrl} from "@/apiFetch/api.ts";

const CardView = () => {
    type Action = "Create" | "Update" | "Stats" | "Delete";
    const [action, setAction] = useState<Action>("Create")
    const [shortorOriginalUrl, setShortorOriginalUrl] = useState<string>("")
    const [updateUrl, setUpdateUrl] = useState<string>("")
    const [createdUrl, setCreatedUrl] = useState<string | null>(null)
    const [urlAccessCount, setUrlAccessCount] = useState<number | null>(null)


    useEffect(() => {
        function cleanUp():void{
            setUpdateUrl("");
            setCreatedUrl(null);
            setShortorOriginalUrl("");
            setUrlAccessCount(null)
        }
        cleanUp();
    },[action])



    async function handleEvents(): Promise<string | number>  {
        switch (action) {
            case "Create":
                 return await createShortUrl(shortorOriginalUrl)
            case "Update":
                 return await updateOriginaltUrl(new URL(shortorOriginalUrl).pathname.slice(1),updateUrl)
            case "Delete":
                return await deleteShortUrl(new URL(shortorOriginalUrl).pathname.slice(1))
            case "Stats":
                return await getShortUrlStats(new URL(shortorOriginalUrl).pathname.slice(1))
        }
    }

    return (
        <Card
            className="
        w-1/2 max-w-md
        rounded-2xl
        bg-gradient-to-t from-gray-900 via-gray-800 to-gray-700
        text-gray-100
        shadow-lg shadow-black/40
        border border-white/10
        transition-all duration-300
        hover:scale-[1.02] hover:shadow-xl
        flex flex-col
      "
        >
            {/* Header */}
            <CardHeader className="gap-2 text-center pb-2">
                <CardTitle
                    className="
      text-xl font-semibold tracking-tight
      bg-gradient-to-r from-blue-400 to-cyan-400
      bg-clip-text text-transparent
    "
                >
                    Smart URL Shortener
                </CardTitle>

                <CardDescription
                    className="
      text-sm
      text-gray-400
      leading-relaxed
      max-w-xs
      mx-auto
    "
                >
                    {{
                        Create: "Generate a short link for your URL.",
                        Update: "Change the destination of an existing short link.",
                        Stats: "View how many times your link was accessed.",
                        Delete: "Remove a short link permanently."
                    }[action]}
                </CardDescription>
            </CardHeader>

            <div className="gap-1 items-center flex flex-col">
                <NativeSelect

                    value={action}
                    onChange={(e) => setAction(e.target.value as Action)}
                    className="
    w-full max-w-xs
    bg-gray-900/70
    text-gray-100
    border border-white/20
    rounded-lg
    px-3 py-2
    pr-8
    text-sm
    shadow-sm
    outline-none
    focus:ring-2 focus:ring-blue-500
    focus:border-blue-500
    transition
    appearance-none
  "
                >
                    <NativeSelectOption value="Create">
                        Create Short URL
                    </NativeSelectOption>
                    <NativeSelectOption value="Update">
                        Change redirect URL
                    </NativeSelectOption>
                    <NativeSelectOption value="Stats">
                        URL Stats
                    </NativeSelectOption>
                    <NativeSelectOption value="Delete">
                        Delete URL
                    </NativeSelectOption>
                </NativeSelect>
            </div>

            {/* Form Section */}
            <CardContent className="space-y-4 px-6">
                <Input
                value={shortorOriginalUrl}
                placeholder={action==="Create" ? "Enter your link" : "Enter your short link"}
                onChange={(e) => setShortorOriginalUrl(e.target.value as string)}
                className="
            bg-gray-900/60
            border-white/20
            text-gray-100
            placeholder:text-gray-400
            focus-visible:ring-2 focus-visible:ring-blue-500
          "
            />

                {action==="Update" && <Input
                    placeholder="Enter The New Link Here"
                    value={updateUrl}
                    onChange={(e) => setUpdateUrl(e.target.value as string)}
                    className="
            bg-gray-900/60
            border-white/20
            text-gray-100
            placeholder:text-gray-400
            focus-visible:ring-2 focus-visible:ring-blue-500
          "
                />}

                {(createdUrl && action ==="Create") && <CopyBox text={createdUrl}/>}

                {urlAccessCount!==null && (<div className="flex items-center w-full h-14 px-4 ">
                    <div className="bg-gray-900/60 w-full h-full flex items-center justify-center px-4 rounded-md">
                        <h6 className="text-sm font-medium text-white text-center">
                            URL Access Count : {urlAccessCount}
                        </h6>
                    </div>
                </div>)}


                <Button
                    variant="secondary"
                    className={`w-full ${action==="Delete" ? "bg-red-500 hover:bg-red-700" : "bg-blue-500 hover:bg-blue-700"} `}
                    onClick={() => {
                        toast.promise(handleEvents(),
                            {
                                loading: "Loading...",
                                success: (data) => {
                                    if(action === "Create" || action === "Update") {
                                        setCreatedUrl(data as string)
                                        if(action === "Update") {
                                            return "Your Link has been updated"
                                        }else{
                                            return "Your Link has been created"
                                        }
                                    }
                                    if(action === "Stats") {
                                        setUrlAccessCount(data as number)
                                        return "Request Successful"
                                    }
                                    return "Your Link has been deleted"
                                },
                                error: "Please check whether the link is valid and try again.",
                            }
                        )
                    }}
                    disabled={
                        action === "Create"
                            ? (!shortorOriginalUrl || !!createdUrl)
                            : action === "Update"
                                ? ((!shortorOriginalUrl || !updateUrl) || !!createdUrl)
                                : !shortorOriginalUrl
                    }
                >
                    {
                        (() => {
                            switch (action) {
                                case "Create":
                                    return <div>Get URL</div>
                                case "Update":
                                    return <div>Change</div>
                                case "Stats":
                                    return <div>Get Stats</div>
                                case "Delete":
                                    return <div>Delete</div>
                            }
                        })()
                    }
                </Button>
                {createdUrl && <Button
                    variant="secondary"
                    onClick={
                        () => {
                            setUpdateUrl("");
                            setCreatedUrl(null);
                            setShortorOriginalUrl("");
                        }
                    }
                    className={`w-full bg-blue-500 hover:bg-blue-700`}>{
                    (() => {
                    switch (action) {
                    case "Create":
                    return <div>Create another URL</div>
                    case "Update":
                    return <div>Update another URL</div>
                }})()
                    }</Button>}
            </CardContent>
            <CardFooter className="justify-center text-xs text-gray-400 border-t border-white/10 pt-3">
                <p>Secure · Fast · Reliable</p>
            </CardFooter>
        </Card>
    );
};

export default CardView;

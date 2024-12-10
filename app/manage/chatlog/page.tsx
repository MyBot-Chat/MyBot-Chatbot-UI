import Chatlog from "@/components/Chatlog"
import TabBar from "@/components/TabBar"

const ChatLog = () => {
    return (
        <>
            <TabBar />
            <div className="mb-5">
                <Chatlog />    
            </div>
        </>
    )
}
export default ChatLog
import { useNavigate } from "react-router-dom";
import { useDrop } from "react-dnd";
import { NativeTypes } from "react-dnd-html5-backend";
import { useDispatch, useSelector } from "react-redux";
// import { useDebounce} from "rooks";
import StyledLink from "./styled";
import { toggleChannelSetting } from "../../../app/slices/ui";
import ChannelIcon from "../../../common/component/ChannelIcon";
import { getUnreadCount } from "../utils";

const NavItem = ({ id, setFiles, contextMenuEventHandler }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const getUnreadCountDebounced=useDebounce(getUnreadCount,300)
  const { channel, mids, messageData, readIndex, loginUid } = useSelector(
    (store) => {
      return {
        channel: store.channels.byId[id],
        mids: store.channelMessage[id],
        messageData: store.message,
        loginUid: store.authData.uid,
        readIndex: store.footprint.readChannels[id],
      };
    }
  );
  const handleChannelSetting = (evt) => {
    evt.preventDefault();
    evt.stopPropagation();
    dispatch(toggleChannelSetting(id));
  };
  const [{ isActive }, drop] = useDrop(() => ({
    accept: [NativeTypes.FILE],
    drop({ dataTransfer }) {
      if (dataTransfer.files.length) {
        // console.log(files, rest);
        setFiles([...dataTransfer.files]);
        navigate(`/chat/channel/${id}`);
        // 重置
        setTimeout(() => {
          setFiles([]);
        }, 300);
      }
    },
    collect: (monitor) => ({
      isActive: monitor.canDrop() && monitor.isOver(),
    }),
  }));
  const { is_public, name } = channel;
  const unreads = getUnreadCount({ mids, messageData, readIndex, loginUid });
  return (
    <StyledLink
      data-cid={id}
      onContextMenu={(evt) => {
        contextMenuEventHandler(evt, id);
      }}
      ref={drop}
      key={id}
      className={`link ${isActive ? "drop_over" : ""}`}
      to={`/chat/channel/${id}`}
    >
      <div className="name" title={name}>
        <ChannelIcon personal={!is_public} />
        <span className={`txt ${unreads == 0 ? "read" : ""}`}>{name}</span>
      </div>
      <div className="icons">
        <i className="setting" onClick={handleChannelSetting}></i>
        {unreads > 0 && (
          <i className={`badge ${unreads > 99 ? "dot" : ""}`}>
            {unreads > 99 ? null : unreads}
          </i>
        )}
      </div>
    </StyledLink>
  );
};

export default NavItem;

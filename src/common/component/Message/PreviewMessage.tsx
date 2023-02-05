import { FC } from "react";
import clsx from "clsx";
import dayjs from "dayjs";
import renderContent from "./renderContent";
import Avatar from "../Avatar";
import StyledWrapper from "./styled";
import { useAppSelector } from "../../../app/store";

interface Props {
  mid?: number;
  context?: "forward" | "pin"
}

const PreviewMessage: FC<Props> = ({ mid = 0, context }) => {
  const { msg, usersData } = useAppSelector((store) => {
    return { msg: store.message[mid], usersData: store.users.byId };
  });
  if (!msg) return null;
  const { from_uid = 0, created_at, content_type, content, thumbnail = "", properties } = msg;
  const { name, avatar } = usersData[from_uid] ?? {};
  const pinMsg = context == "pin";
  return (
    <StyledWrapper className={clsx(`preview`, pinMsg && "max-h-64 !bg-transparent overflow-auto overflow-x-hidden border border-solid border-gray-200 dark:border-gray-400")}>
      <div className="avatar">
        <Avatar width={40} height={40} src={avatar} name={name} />
      </div>
      <div className="details">
        <div className="up">
          <span className="name">{name}</span>
          <i className="time">{dayjs(created_at).format("YYYY-MM-DD h:mm:ss A")}</i>
        </div>
        <div className={`down`}>
          {renderContent({
            content_type,
            content,
            thumbnail,
            from_uid,
            properties
          })}
        </div>
      </div>
    </StyledWrapper>
  );
};

export default PreviewMessage;

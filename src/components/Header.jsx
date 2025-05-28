import arrowLeft from "../assets/header/input/arrow-left.svg";
import dotButton from "../assets/Header/input/dot-button.svg";
import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();

  return (
    <>
      <div className="w-[1440px] h-20 px-10 bg-White shadow-[0px_-1px_11.600000381469727px_0px_rgba(0,0,0,0.25)] inline-flex justify-between items-center">
        <div data-count="1" className="flex justify-start items-center gap-1.0">
          <button
            data-color="black"
            data-icon="only"
            data-property="default"
            data-size="small"
            data-style="ghost"
            className="w-14 h-14 px-4 py-1 bg-White rounded inline-flex justify-center items-center gap-2.5"
          >
            <img
              src={arrowLeft}
              alt="Arrow Left"
              className="w-[50px] h-[50px]"
            />
          </button>
          <div className="flex justify-start items-center">
            <div className="justify-start text-Black text-xl font-medium font-['Pretendard'] leading-normal">
              Upload file
            </div>
          </div>
        </div>
        <div className="flex justify-start items-center gap-2.5">
          <div
            data-color="black"
            data-icon="none"
            data-property="default"
            data-size="small"
            data-style="stroke"
            className="h-9 px-3.5 py-1 bg-White rounded outline outline-1 outline-offset-[-1px] outline-Gray-Grayscale-200 flex justify-center items-center gap-2.5 cursor-pointer"
            onClick={() => navigate("/my-files")}
          >
            <span className="text-base font-normal text-Black">My files</span>
          </div>
          <div
            data-color="primary"
            data-icon="none"
            data-property="default"
            data-size="small"
            data-style="default"
            className="bg-[#198CFF] h-9 px-3.5 py-1 bg-Primary-Primary-500 rounded flex justify-center items-center gap-2.5"
          >
            <button className="text-[#FFFFFF] text-center justify-start text-White text-base font-normal font-['Pretendard'] leading-tight">
              Upload file
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;

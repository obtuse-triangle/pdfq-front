import filePlusBlue from "../../assets/section/file-plus-blue.svg";
import award from "../../assets/section/award.svg";
import clipboard from "../../assets/section/clipboard-list.svg";

function FeatureBoxes() {
  return (
    <div className="inline-flex gap-x-1 justify-start items-center inline-flex">
      <div className="w-96 h-48 border-r border-[#000] inline-flex flex-col justify-start items-center gap-10">
        <div className="self-stretch flex flex-col justify-start items-center">
          <div className="w-16 h-16 relative">
            <div className="w-11 h-14 left-[10.67px] top-[5.33px] absolute " />
            <img src={filePlusBlue} alt="blue-file-plus" />
          </div>
          <div className="self-stretch text-center justify-start text-Black text-3xl font-medium font-['Pretendard'] leading-nomal">
            Upload file
          </div>
        </div>
        <div className="self-stretch text-center justify-start text-Black text-xl font-normal font-['Pretendard'] leading-normal">
          Upload your file <br />
          to split into units.
        </div>
      </div>
      <div className="w-96 h-48 border-r border-[#000] inline-flex flex-col justify-start items-center gap-10">
        <div className="self-stretch flex flex-col justify-start items-center">
          <div className="w-16 h-16 relative">
            <div className="w-8 h-14 left-[16px] top-[5.33px] absolute " />
            <img src={award} alt="award" />
          </div>
          <div className="self-stretch text-center justify-start text-Black text-3xl font-medium font-['Pretendard'] leading-nomal">
            Practice by Unit
          </div>
        </div>
        <div className="self-stretch text-center justify-start text-Black text-xl font-normal font-['Pretendard'] leading-normal">
          Solve problems
          <br />
          provided for each unit.
        </div>
      </div>
      <div className="w-96 h-48 inline-flex flex-col justify-start items-center gap-10">
        <div className="self-stretch flex flex-col justify-start items-center">
          <div className="w-16 h-16 relative overflow-hidden">
            <div className="w-11 h-14 left-[10.67px] top-[5.33px] absolute " />
            <img src={clipboard} alt="clipboard" />
          </div>
          <div className="self-stretch text-center justify-start text-Black text-3xl font-medium font-['Pretendard'] leading-nomal">
            Manage files
          </div>
        </div>
        <div className="self-stretch text-center justify-start text-Black text-xl font-normal font-['Pretendard'] leading-normal">
          You can manage <br />
          all of your uploaded files.
        </div>
      </div>
    </div>
  );
}

export default FeatureBoxes;

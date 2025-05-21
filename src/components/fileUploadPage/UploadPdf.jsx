import UploadBox from "./UploadBox";
import FeatureBoxes from "./FeatureBoxes";

function UploadPdf() {
  return (
    <>
      <section className="w-[1440px] h-full flex justify-center items-center mt-[50px]">
        <div className="w-[1120px] inline-flex flex-col justify-start items-center gap-20">
          <div className="self-stretch flex flex-col justify-start items-center gap-10">
            <div className="flex flex-col justify-start items-center gap-2.5">
              <div className="w-[474px] text-center justify-start text-Black text-3xl font-medium font-['Pretendard'] leading-nomal">
                Upload your File to start learning
              </div>
              <div className="w-[632px] text-center justify-start text-Black text-xl font-normal font-['Pretendard'] leading-normal">
                you can upload pdf, markdown, html file. maximum size is 15Mb
              </div>
            </div>
            <UploadBox />
          </div>
          <FeatureBoxes />
        </div>
      </section>
    </>
  );
}

export default UploadPdf;

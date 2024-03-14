"use client";

import {
  BasicTextStyleButton,
  BlockTypeDropdown,
  ColorStyleButton,
  CreateLinkButton,
  FormattingToolbar,
  FormattingToolbarController,
  ImageCaptionButton,
  NestBlockButton,
  ReplaceImageButton,
  TextAlignButton,
  UnnestBlockButton,
} from "@blocknote/react";
import AiDropdown from "./ai-dropdown";

const CustomFormattingToolbar = () => {
  return (
    <FormattingToolbarController
      formattingToolbar={() => (
        <FormattingToolbar>
          <AiDropdown key={"aiDropdown"} />

          <BlockTypeDropdown key={"blockTypeDropdown"} />

          <ImageCaptionButton key={"imageCaptionButton"} />
          <ReplaceImageButton key={"replaceImageButton"} />

          <BasicTextStyleButton
            basicTextStyle={"bold"}
            key={"boldStyleButton"}
          />
          <BasicTextStyleButton
            basicTextStyle={"italic"}
            key={"italicStyleButton"}
          />
          <BasicTextStyleButton
            basicTextStyle={"underline"}
            key={"underlineStyleButton"}
          />
          <BasicTextStyleButton
            basicTextStyle={"strike"}
            key={"strikeStyleButton"}
          />
          {/* Extra button to toggle code styles */}
          <BasicTextStyleButton
            key={"codeStyleButton"}
            basicTextStyle={"code"}
          />

          <TextAlignButton textAlignment={"left"} key={"textAlignLeftButton"} />
          <TextAlignButton
            textAlignment={"center"}
            key={"textAlignCenterButton"}
          />
          <TextAlignButton
            textAlignment={"right"}
            key={"textAlignRightButton"}
          />

          <ColorStyleButton key={"colorStyleButton"} />

          <NestBlockButton key={"nestBlockButton"} />
          <UnnestBlockButton key={"unnestBlockButton"} />

          <CreateLinkButton key={"createLinkButton"} />
        </FormattingToolbar>
      )}
    />
  );
};

export default CustomFormattingToolbar;

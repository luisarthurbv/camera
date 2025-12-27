import os
import re
from typing import List

from .models import Speech, SpeechMetadata


class ATAProcessor:
    """Parses the Brazilian Chamber of Deputies transcript into a structured format."""

    @staticmethod
    def parse_md(md_path: str) -> List[Speech]:
        if not os.path.exists(md_path):
            raise FileNotFoundError(f"File {md_path} not found.")

        with open(md_path, "r", encoding="utf-8") as f:
            lines = f.readlines()

        speeches = []
        current_section = "Unknown"

        # Regex for speakers: O SR. [INFO] - [TEXT] or A SRA. [INFO] - [TEXT]
        speaker_pattern = re.compile(r"^(O SR\.|A SRA\.)\s+(.+?)\s*-\s*(.*)", re.DOTALL)
        # Regex for sections: ALL CAPS lines (e.g., BREVES COMUNICAÇÕES)
        section_pattern = re.compile(r"^[A-ZÀ-Ú\s]+$")
        # Regex for page markers
        page_marker_pattern = re.compile(
            r"^(\d+/\d+|\x0c?Sessão de.*|Notas Taquigráficas|CÂMARA DOS DEPUTADOS|DEPARTAMENTO DE.*|.*SESSÃO LEGISLATIVA.*|.*SESSÃO.*|^\d+$)",
            re.IGNORECASE,
        )

        current_speaker_info = None
        current_speech_text = []

        def flush_speech():
            nonlocal current_speaker_info, current_speech_text
            if current_speaker_info and current_speech_text:
                full_text = " ".join(current_speech_text).strip()
                if full_text:
                    speeches.append(
                        Speech(
                            text=full_text,
                            metadata=SpeechMetadata(
                                section=current_section,
                                speaker=current_speaker_info["name"],
                                metadata=current_speaker_info["meta"],
                            ),
                        )
                    )
                current_speaker_info = None
                current_speech_text = []

        for line in lines:
            line = line.strip()
            if not line:
                continue

            if page_marker_pattern.match(line):
                continue

            if (
                section_pattern.match(line)
                and len(line) > 5
                and not speaker_pattern.match(line)
            ):
                flush_speech()
                current_section = line
                continue

            match = speaker_pattern.match(line)
            if match:
                flush_speech()
                prefix, info, first_part = match.groups()

                name_meta = re.search(r"\((.+?)\)", info)
                if name_meta:
                    metadata = name_meta.group(1)
                    speaker_name = info.split("(")[0].strip()
                else:
                    speaker_name = info
                    metadata = ""

                current_speaker_info = {"name": speaker_name, "meta": metadata}
                current_speech_text = [first_part]
            else:
                if current_speaker_info:
                    current_speech_text.append(line)

        flush_speech()
        return speeches

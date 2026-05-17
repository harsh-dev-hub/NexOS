from dataclasses import dataclass


@dataclass
class RunnerConfig:
    image: str
    source_filename: str
    compile_cmd: str | None
    run_cmd: str

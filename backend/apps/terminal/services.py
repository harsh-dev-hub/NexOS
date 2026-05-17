def sanitize_terminal_input(data: str) -> str:
    return data.replace('\x00', '')

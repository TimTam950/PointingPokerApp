import logging

import uvicorn


def create_logger(name: str) -> logging.Logger:
    logger = logging.getLogger(name=name)
    logger.setLevel(logging.DEBUG)

    # create console handler and set level to debug
    ch = logging.StreamHandler()
    ch.setLevel(logging.DEBUG)

    # create formatter
    logging_format: str = "%(levelprefix)s %(asctime)s | %(message)s"
    formatter = uvicorn.logging.DefaultFormatter(logging_format, datefmt="%Y-%m-%d %H:%M:%S")

    # add formatter to ch
    ch.setFormatter(formatter)

    # add ch to logger
    logger.addHandler(ch)
    return logger

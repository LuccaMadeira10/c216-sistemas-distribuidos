import time
import urllib.request

API_URL = "http://backend:8000/"
INTERVALO_SEGUNDOS = 10


def main():
    while True:
        try:
            with urllib.request.urlopen(API_URL, timeout=5) as resp:
                print(f"worker: API respondeu {resp.status}")
        except Exception as e:
            print(f"worker: erro ao chamar a API - {e}")
        time.sleep(INTERVALO_SEGUNDOS)


if __name__ == "__main__":
    main()

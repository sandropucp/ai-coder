import subprocess
import sys
import os
import argparse

def run_command(command, description):
    print(f"--- {description} ---")
    try:
        subprocess.run(command, check=True, shell=True)
    except subprocess.CalledProcessError as e:
        print(f"Error: {e}")
        sys.exit(1)

def start():
    run_command("docker compose up --build -d", "Starting Docker containers in background")
    print("\nApplication started at http://localhost:8000")

def stop():
    run_command("docker compose down", "Stopping Docker containers")

def logs():
    run_command("docker compose logs -f", "Showing logs (Ctrl+C to exit)")

def main():
    parser = argparse.ArgumentParser(description="PM MVP Management Script")
    parser.add_argument("action", choices=["start", "stop", "logs", "restart"], help="Action to perform")
    
    args = parser.parse_args()
    
    if args.action == "start":
        start()
    elif args.action == "stop":
        stop()
    elif args.action == "logs":
        logs()
    elif args.action == "restart":
        stop()
        start()

if __name__ == "__main__":
    main()

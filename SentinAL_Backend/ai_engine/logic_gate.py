from datetime import date

def check_breach(contract, scraped_location):
    """
    Determines if the usage violates the Contract terms.
    Returns: 'CLEAN', 'PIRACY', or 'TERRITORY'
    """
    
    # 1. Check Expiry
    if contract.expiry_date < date.today():
        print(f"   [!] Contract Expired on {contract.expiry_date}")
        return "EXPIRED_LICENSE"

    # 2. Check Territory
    # Convert "IN,US" string to list ['IN', 'US']
    allowed_list = [code.strip().upper() for code in contract.allowed_territory.split(',')]
    
    if scraped_location.upper() not in allowed_list:
        print(f"   [!] Territory Breach! Found in {scraped_location}, Allowed: {allowed_list}")
        return "TERRITORY"

    print("   [+] Usage is Compliant.")
    return "CLEAN"
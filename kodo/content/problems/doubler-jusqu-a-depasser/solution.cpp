#include <iostream>
using namespace std;

int main() {
    long long a, b;
    cin >> a >> b;
    long long colonie = a;
    int heures = 0;
    while (colonie <= b) {   // pas encore strictement plus de B
        colonie = colonie * 2;
        heures = heures + 1;
    }
    cout << heures << "\n";
    return 0;
}

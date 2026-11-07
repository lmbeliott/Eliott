#include <iostream>
using namespace std;

int main() {
    int a;
    cin >> a;
    // Les règles les plus particulières d'abord.
    if (a % 400 == 0) {
        cout << "OUI\n";
    } else if (a % 100 == 0) {
        cout << "NON\n";
    } else if (a % 4 == 0) {
        cout << "OUI\n";
    } else {
        cout << "NON\n";
    }
    return 0;
}

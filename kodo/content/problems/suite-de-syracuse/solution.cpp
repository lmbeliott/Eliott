#include <iostream>
using namespace std;

int main() {
    long long n;
    cin >> n;
    int etapes = 0;
    long long plus_grand = n;   // la valeur de départ compte
    while (n != 1) {
        if (n % 2 == 0) {
            n = n / 2;
        } else {
            n = 3 * n + 1;
        }
        etapes = etapes + 1;
        if (n > plus_grand) {
            plus_grand = n;
        }
    }
    cout << etapes << " " << plus_grand << "\n";
    return 0;
}

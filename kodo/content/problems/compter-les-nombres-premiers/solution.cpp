#include <iostream>
using namespace std;

int main() {
    int N;
    cin >> N;
    int nombre = 0;
    int plus_grand = 0;
    for (int n = 2; n <= N; n++) {
        bool premier = true;        // remis à vrai pour chaque candidat
        int d = 2;
        while (d * d <= n && premier) {
            if (n % d == 0) {
                premier = false;    // un diviseur trouvé : n n'est pas premier
            }
            d = d + 1;
        }
        if (premier) {
            nombre = nombre + 1;
            plus_grand = n;
        }
    }
    cout << nombre << " " << plus_grand << "\n";
    return 0;
}

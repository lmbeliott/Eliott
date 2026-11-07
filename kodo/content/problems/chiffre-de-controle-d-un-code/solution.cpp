#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    int s = 0;
    for (int position = 1; position <= n; position++) {
        int chiffre;
        cin >> chiffre;
        s = s + position * chiffre;
    }
    cout << s << "\n";
    // Ce qu'il faut ajouter pour atteindre un multiple de 10 (0 si c'en est déjà un).
    cout << (10 - s % 10) % 10 << "\n";
    return 0;
}
